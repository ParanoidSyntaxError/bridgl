package fee_manager

import (
	"errors"
	"fmt"

	"github.com/ethereum/go-ethereum/common"
	goEthTypes "github.com/ethereum/go-ethereum/core/types"

	"github.com/smartcontractkit/chainlink-evm/gethwrappers/llo-feeds/generated/fee_manager_v0_5_0"

	cldf "github.com/smartcontractkit/chainlink-deployments-framework/deployment"

	"github.com/smartcontractkit/chainlink/deployment/data-streams/changeset/types"
	"github.com/smartcontractkit/chainlink/deployment/data-streams/utils/mcmsutil"
	"github.com/smartcontractkit/chainlink/deployment/data-streams/utils/txutil"
)

// PayLinkDeficitChangeset pay the LINK deficit for a given config digest
var PayLinkDeficitChangeset cldf.ChangeSetV2[PayLinkDeficitConfig] = &payLinkDeficit{}

type payLinkDeficit struct{}

type PayLinkDeficitConfig struct {
	ConfigPerChain map[uint64][]PayLinkDeficit
	MCMSConfig     *types.MCMSConfig
}

type PayLinkDeficit struct {
	FeeManagerAddress common.Address
	ConfigDigest      [32]byte
}

func (a PayLinkDeficit) GetContractAddress() common.Address {
	return a.FeeManagerAddress
}

func (cs payLinkDeficit) Apply(e cldf.Environment, cfg PayLinkDeficitConfig) (cldf.ChangesetOutput, error) {
	txs, err := txutil.GetTxs(
		e,
		types.FeeManager.String(),
		cfg.ConfigPerChain,
		LoadFeeManagerState,
		doPayLinkDeficit,
	)
	if err != nil {
		return cldf.ChangesetOutput{}, fmt.Errorf("failed building Withdraw txs: %w", err)
	}

	return mcmsutil.ExecuteOrPropose(e, txs, cfg.MCMSConfig, "Withdraw proposal")
}

func (cs payLinkDeficit) VerifyPreconditions(e cldf.Environment, cfg PayLinkDeficitConfig) error {
	if len(cfg.ConfigPerChain) == 0 {
		return errors.New("ConfigPerChain is empty")
	}
	for cs := range cfg.ConfigPerChain {
		if err := cldf.IsValidChainSelector(cs); err != nil {
			return fmt.Errorf("invalid chain selector: %d - %w", cs, err)
		}
	}
	return nil
}

func doPayLinkDeficit(
	fm *fee_manager_v0_5_0.FeeManager,
	c PayLinkDeficit,
) (*goEthTypes.Transaction, error) {
	return fm.PayLinkDeficit(
		cldf.SimTransactOpts(),
		c.ConfigDigest)
}
