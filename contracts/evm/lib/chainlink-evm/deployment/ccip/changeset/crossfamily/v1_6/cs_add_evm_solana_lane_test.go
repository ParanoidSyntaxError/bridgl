package v1_6_test

import (
	"math/big"
	"testing"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/gagliardetto/solana-go"
	"github.com/stretchr/testify/require"

	solOffRamp "github.com/smartcontractkit/chainlink-ccip/chains/solana/gobindings/ccip_offramp"
	solRouter "github.com/smartcontractkit/chainlink-ccip/chains/solana/gobindings/ccip_router"
	solFeeQuoter "github.com/smartcontractkit/chainlink-ccip/chains/solana/gobindings/fee_quoter"
	solState "github.com/smartcontractkit/chainlink-ccip/chains/solana/utils/state"
	"github.com/smartcontractkit/chainlink-testing-framework/lib/utils/testcontext"

	"github.com/smartcontractkit/chainlink-common/pkg/utils/tests"

	crossfamily "github.com/smartcontractkit/chainlink/deployment/ccip/changeset/crossfamily/v1_6"
	ccipChangesetSolana "github.com/smartcontractkit/chainlink/deployment/ccip/changeset/solana"
	"github.com/smartcontractkit/chainlink/deployment/ccip/changeset/testhelpers"
	"github.com/smartcontractkit/chainlink/deployment/ccip/changeset/v1_6"
	"github.com/smartcontractkit/chainlink/deployment/ccip/shared/stateview"
	commonchangeset "github.com/smartcontractkit/chainlink/deployment/common/changeset"
	"github.com/smartcontractkit/chainlink/deployment/common/proposalutils"
)

func TestAddEVMSolanaLaneBidirectional(t *testing.T) {
	for _, tc := range []struct {
		name        string
		mcmsEnabled bool
	}{
		{
			name:        "MCMS disabled",
			mcmsEnabled: false,
		},
		{
			name:        "MCMS enabled",
			mcmsEnabled: true,
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			if t.Name() == "TestAddEVMSolanaLaneBidirectional/MCMS_enabled" {
				tests.SkipFlakey(t, "https://smartcontract-it.atlassian.net/browse/DX-758")
			}
			if t.Name() == "TestAddEVMSolanaLaneBidirectional/MCMS_disabled" {
				tests.SkipFlakey(t, "https://smartcontract-it.atlassian.net/browse/DX-759")
			}
			t.Parallel()
			ctx := testcontext.Get(t)
			tenv, _ := testhelpers.NewMemoryEnvironment(t, testhelpers.WithSolChains(1))
			e := tenv.Env
			solChains := tenv.Env.AllChainSelectorsSolana()
			require.NotEmpty(t, solChains)
			evmChains := tenv.Env.AllChainSelectors()
			require.NotEmpty(t, evmChains)
			solChain := solChains[0]
			evmChain := evmChains[0]
			evmState, err := stateview.LoadOnchainState(e)
			require.NoError(t, err)
			var mcmsConfig *proposalutils.TimelockConfig
			if tc.mcmsEnabled {
				_, _ = testhelpers.TransferOwnershipSolana(t, &e, solChain, true,
					ccipChangesetSolana.CCIPContractsToTransfer{
						Router:    true,
						FeeQuoter: true,
						OffRamp:   true,
					})
				mcmsConfig = &proposalutils.TimelockConfig{
					MinDelay: 1 * time.Second,
				}
				testhelpers.TransferToTimelock(t, tenv, evmState, []uint64{evmChain}, false)
			}

			// Add EVM and Solana lane
			evmChainState := evmState.Chains[evmChain]
			feeQCfgSolana := solFeeQuoter.DestChainConfig{
				IsEnabled:                   true,
				DefaultTxGasLimit:           200000,
				MaxPerMsgGasLimit:           3000000,
				MaxDataBytes:                30000,
				MaxNumberOfTokensPerMsg:     5,
				DefaultTokenDestGasOverhead: 90000,
				DestGasOverhead:             90000,
				// bytes4(keccak256("CCIP ChainFamilySelector EVM"))
				ChainFamilySelector: [4]uint8{40, 18, 213, 44},
			}
			feeQCfgEVM := v1_6.DefaultFeeQuoterDestChainConfig(true, solChain)
			evmSolanaLaneCSInput := crossfamily.AddRemoteChainE2EConfig{
				SolanaChainSelector:                  solChain,
				EVMChainSelector:                     evmChain,
				IsTestRouter:                         true,
				EVMOnRampAllowListEnabled:            false,
				EVMFeeQuoterDestChainInput:           feeQCfgEVM,
				InitialSolanaGasPriceForEVMFeeQuoter: testhelpers.DefaultGasPrice,
				InitialEVMTokenPricesForEVMFeeQuoter: map[common.Address]*big.Int{
					evmChainState.LinkToken.Address(): testhelpers.DefaultLinkPrice,
					evmChainState.Weth9.Address():     testhelpers.DefaultWethPrice,
				},
				IsRMNVerificationDisabledOnEVMOffRamp: true,
				SolanaRouterConfig: ccipChangesetSolana.RouterConfig{
					RouterDestinationConfig: solRouter.DestChainConfig{
						AllowListEnabled: true,
						AllowedSenders:   []solana.PublicKey{e.SolChains[solChain].DeployerKey.PublicKey()},
					},
				},
				SolanaOffRampConfig: ccipChangesetSolana.OffRampConfig{
					EnabledAsSource: true,
				},
				SolanaFeeQuoterConfig: ccipChangesetSolana.FeeQuoterConfig{
					FeeQuoterDestinationConfig: feeQCfgSolana,
				},
				MCMSConfig: mcmsConfig,
			}

			// run the changeset
			e, _, err = commonchangeset.ApplyChangesetsV2(t, e, []commonchangeset.ConfiguredChangeSet{
				commonchangeset.Configure(crossfamily.AddEVMAndSolanaLaneChangeset, evmSolanaLaneCSInput),
			})
			require.NoError(t, err)

			// Check that the changeset was applied
			evmState, err = stateview.LoadOnchainState(e)
			require.NoError(t, err)

			solanaState, err := stateview.LoadOnchainStateSolana(e)
			require.NoError(t, err)

			// evm changes
			evmChainState = evmState.Chains[evmChain]

			destCfg, err := evmChainState.OnRamp.GetDestChainConfig(&bind.CallOpts{Context: ctx}, solChain)
			require.NoError(t, err)
			require.Equal(t, evmChainState.TestRouter.Address(), destCfg.Router)
			require.False(t, destCfg.AllowlistEnabled)

			srcCfg, err := evmChainState.OffRamp.GetSourceChainConfig(&bind.CallOpts{Context: ctx}, solChain)
			require.NoError(t, err)
			require.Equal(t, evmChainState.TestRouter.Address(), destCfg.Router)
			require.True(t, srcCfg.IsRMNVerificationDisabled)
			require.True(t, srcCfg.IsEnabled)
			expOnRamp, err := evmState.GetOnRampAddressBytes(solChain)
			require.NoError(t, err)
			require.Equal(t, expOnRamp, srcCfg.OnRamp)

			fqDestCfg, err := evmChainState.FeeQuoter.GetDestChainConfig(&bind.CallOpts{Context: ctx}, solChain)
			require.NoError(t, err)
			testhelpers.AssertEqualFeeConfig(t, feeQCfgEVM, fqDestCfg)

			// solana changes
			var offRampSourceChain solOffRamp.SourceChain
			var destChainStateAccount solRouter.DestChain
			var destChainFqAccount solFeeQuoter.DestChain
			var offRampEvmSourceChainPDA solana.PublicKey
			var evmDestChainStatePDA solana.PublicKey
			var fqEvmDestChainPDA solana.PublicKey
			offRampEvmSourceChainPDA, _, _ = solState.FindOfframpSourceChainPDA(evmChain, solanaState.SolChains[solChain].OffRamp)
			err = e.SolChains[solChain].GetAccountDataBorshInto(e.GetContext(), offRampEvmSourceChainPDA, &offRampSourceChain)
			require.NoError(t, err)
			require.True(t, offRampSourceChain.Config.IsEnabled)

			fqEvmDestChainPDA, _, _ = solState.FindFqDestChainPDA(evmChain, solanaState.SolChains[solChain].FeeQuoter)
			err = e.SolChains[solChain].GetAccountDataBorshInto(e.GetContext(), fqEvmDestChainPDA, &destChainFqAccount)
			require.NoError(t, err, "failed to get account info")
			require.Equal(t, solFeeQuoter.TimestampedPackedU224{}, destChainFqAccount.State.UsdPerUnitGas)
			require.True(t, destChainFqAccount.Config.IsEnabled)
			require.Equal(t, feeQCfgSolana, destChainFqAccount.Config)

			evmDestChainStatePDA, _ = solState.FindDestChainStatePDA(evmChain, solanaState.SolChains[solChain].Router)
			err = e.SolChains[solChain].GetAccountDataBorshInto(e.GetContext(), evmDestChainStatePDA, &destChainStateAccount)
			require.NoError(t, err)
			require.NotEmpty(t, destChainStateAccount.Config.AllowedSenders)
			require.True(t, destChainStateAccount.Config.AllowListEnabled)
		})
	}
}
