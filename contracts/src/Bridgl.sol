// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IRouterClient} from "@chainlink/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/ccip/applications/CCIPReceiver.sol";

import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {Clones} from "@openzeppelin/proxy/Clones.sol";

import {BridglWrapper, IBridglWrapper} from "./token/BridglWrapper.sol";
import {IBridgl} from "./IBridgl.sol";

contract Bridgl is CCIPReceiver, IBridgl {
    address private immutable _wrapperImplementation;

    // Chain selector -> Bridgl address -> Underlying token -> Wrapped token
    mapping(uint64 => mapping(address => mapping(address => address))) private _wrappedTokens;

    constructor(
        address ccipRouter
    ) CCIPReceiver(ccipRouter) {
        _wrapperImplementation = address(new BridglWrapper());
    }

    receive() external payable {}

    function wrap(
        uint64 destinationChainSelector,
        address destinationAddress,
        address underlyingToken,
        address to,
        uint256 amount
    ) external payable override returns (bytes32) {
        SafeERC20.safeTransferFrom(IERC20(underlyingToken), msg.sender, address(this), amount);

        string memory wrappedName = string(abi.encodePacked("Bridgl ", IERC20Metadata(underlyingToken).name()));
        string memory wrappedSymbol = string(abi.encodePacked("b", IERC20Metadata(underlyingToken).symbol()));

        Client.EVM2AnyMessage memory evm2AnyMessage = _buildMessage(
            destinationAddress,
            MessageData({
                selector: 0,
                data: abi.encode(WrapParams({
                    name: wrappedName,
                    symbol: wrappedSymbol,
                    underlyingToken: underlyingToken,
                    to: to,
                    amount: amount
                }))
            })
        );

        IRouterClient router = IRouterClient(this.getRouter());

        uint256 fees = router.getFee(destinationChainSelector, evm2AnyMessage);
        if (fees > address(this).balance) {
            revert InsufficientFees(address(this).balance, fees);
        }

        bytes32 messageId = router.ccipSend{value: fees}(
            destinationChainSelector,
            evm2AnyMessage
        );

        emit SourceWrap(
            destinationChainSelector,
            destinationAddress,
            underlyingToken,
            msg.sender,
            to,
            amount,
            messageId
        );

        return messageId;
    }

    function unwrap(
        uint64 destinationChainSelector,
        address destinationAddress,
        address underlyingToken,
        address to,
        uint256 amount
    ) external payable override returns (bytes32) {
        if (!_wrapperExists(destinationChainSelector, destinationAddress, underlyingToken)) {
            revert WrapperDoesNotExist(destinationChainSelector, destinationAddress, underlyingToken);
        }

        address wrappedToken = _wrapper(destinationChainSelector, destinationAddress, underlyingToken);

        IBridglWrapper(wrappedToken).burn(msg.sender, amount);

        Client.EVM2AnyMessage memory evm2AnyMessage = _buildMessage(
            destinationAddress,
            MessageData({
                selector: 1,
                data: abi.encode(UnwrapParams({
                    underlyingToken: underlyingToken,
                    to: to,
                    amount: amount
                }))
            })
        );

        IRouterClient router = IRouterClient(this.getRouter());

        uint256 fees = router.getFee(destinationChainSelector, evm2AnyMessage);
        if (fees > address(this).balance) {
            revert InsufficientFees(address(this).balance, fees);
        }

        bytes32 messageId = router.ccipSend{value: fees}(
            destinationChainSelector,
            evm2AnyMessage
        );

        emit SourceUnwrap(
            destinationChainSelector,
            destinationAddress,
            underlyingToken,
            wrappedToken,
            msg.sender,
            to,
            amount,
            messageId
        );

        return messageId;
    }

    function wrapperImplementation() external view override returns (address) {
        return _wrapperImplementation;
    }

    function wrapper(
        uint64 chainSelector,
        address bridgl,
        address underlyingToken
    ) external view override returns (address) {
        return _wrapper(chainSelector, bridgl, underlyingToken);
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        MessageData memory message = abi.decode(
            any2EvmMessage.data,
            (MessageData)
        );

        if(message.selector == 0) {
            WrapParams memory wrapParams = abi.decode(message.data, (WrapParams));

            _wrapTokens(
                any2EvmMessage.sourceChainSelector, 
                abi.decode(any2EvmMessage.sender, (address)), 
                wrapParams.name,
                wrapParams.symbol,
                wrapParams.underlyingToken, 
                wrapParams.to, wrapParams.amount
            );

            emit DestinationWrap(
                _wrapper(
                    any2EvmMessage.sourceChainSelector,
                    abi.decode(any2EvmMessage.sender, (address)),
                    wrapParams.underlyingToken
                ),
                any2EvmMessage.messageId
            );
        } else {
            UnwrapParams memory unwrapParams = abi.decode(message.data, (UnwrapParams));

            _unwrapTokens(
                unwrapParams.underlyingToken, 
                unwrapParams.to, 
                unwrapParams.amount
            );

            emit DestinationUnwrap(
                any2EvmMessage.messageId
            );
        }
    }

    function _wrapTokens(
        uint64 sourceChainSelector,
        address sourceAddress,
        string memory wrappedName,
        string memory wrappedSymbol,
        address underlyingToken,
        address to,
        uint256 amount
    ) internal {
        address wrappedToken = _wrappedTokens[sourceChainSelector][sourceAddress][underlyingToken];

        if (wrappedToken == address(0)) {
            wrappedToken = Clones.clone(_wrapperImplementation);
            BridglWrapper(wrappedToken)
                .initialize(
                    wrappedName,
                    wrappedSymbol,
                    sourceChainSelector,
                    underlyingToken,
                    address(this)
                );
            _wrappedTokens[sourceChainSelector][sourceAddress][underlyingToken] = wrappedToken;

            emit NewWrapper(
                underlyingToken,
                wrappedToken
            );
        }

        IBridglWrapper(wrappedToken).mint(to, amount);
    }

    function _unwrapTokens(
        address underlyingToken,
        address to,
        uint256 amount
    ) internal {
        SafeERC20.safeTransfer(IERC20(underlyingToken), to, amount);
    }

    function _wrapper(
        uint64 chainSelector,
        address bridgl,
        address underlyingToken
    ) internal view returns (address) {
        return _wrappedTokens[chainSelector][bridgl][underlyingToken];
    }

    function _wrapperExists(
        uint64 chainSelector,
        address bridgl,
        address underlyingToken
    ) internal view returns (bool) {
        return _wrapper(chainSelector, bridgl, underlyingToken) != address(0);
    }

    function _buildMessage(
        address destinationAddress,
        MessageData memory params
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(destinationAddress),
                data: abi.encode(params),
                tokenAmounts: new Client.EVMTokenAmount[](0),
                extraArgs: Client._argsToBytes(
                    Client.GenericExtraArgsV2({
                        gasLimit: 500_000,
                        allowOutOfOrderExecution: true
                    })
                ),
                feeToken: address(0)
            });
    }
}
