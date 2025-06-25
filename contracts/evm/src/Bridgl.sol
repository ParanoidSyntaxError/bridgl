// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IRouterClient} from "@chainlink/contracts/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts/src/v0.8/ccip/applications/CCIPReceiver.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {BridglWrapper, IBridglWrapper} from "./token/BridglWrapper.sol";
import {IBridgl} from "./IBridgl.sol";

contract Bridgl is CCIPReceiver, IBridgl {
    address private immutable _wrapperImplementation;

    // Chain selector -> Bridgl address -> Underlying token -> Wrapped token
    mapping(uint64 => mapping(bytes => mapping(bytes => address))) private _wrappedTokens;

    constructor(
        address ccipRouter
    ) CCIPReceiver(ccipRouter) {
        _wrapperImplementation = address(new BridglWrapper());
    }

    receive() external payable {}

    function wrap(
        uint64 destinationChainSelector,
        bytes memory bridglAddress,
        bytes memory extraArgs,
        address underlyingToken,
        bytes memory to,
        uint256 amount
    ) external payable override returns (bytes32) {
        SafeERC20.safeTransferFrom(IERC20(underlyingToken), msg.sender, address(this), amount);

        string memory wrappedName = string(abi.encodePacked("Bridgl ", IERC20Metadata(underlyingToken).name()));
        string memory wrappedSymbol = string(abi.encodePacked("b", IERC20Metadata(underlyingToken).symbol()));

        Client.EVM2AnyMessage memory evm2AnyMessage = _buildMessage(
            bridglAddress,
            extraArgs,
            MessageData({
                selector: 0,
                data: abi.encode(WrapParams({
                    name: wrappedName,
                    symbol: wrappedSymbol,
                    underlyingToken: abi.encode(underlyingToken),
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
            bridglAddress,
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
        bytes memory bridglAddress,
        bytes memory extraArgs,
        bytes memory underlyingToken,
        bytes memory to,
        uint256 amount
    ) external payable override returns (bytes32) {
        if (!_wrapperExists(destinationChainSelector, bridglAddress, underlyingToken)) {
            revert WrapperDoesNotExist(destinationChainSelector, bridglAddress, underlyingToken);
        }

        address wrappedToken = _wrapper(destinationChainSelector, bridglAddress, underlyingToken);

        IBridglWrapper(wrappedToken).burn(msg.sender, amount);

        Client.EVM2AnyMessage memory evm2AnyMessage = _buildMessage(
            bridglAddress,
            extraArgs,
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
            bridglAddress,
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
        bytes memory bridglAddress,
        bytes memory underlyingToken
    ) external view override returns (address) {
        return _wrapper(chainSelector, bridglAddress, underlyingToken);
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

            address to = abi.decode(wrapParams.to, (address));

            _wrapTokens(
                any2EvmMessage.sourceChainSelector, 
                any2EvmMessage.sender, 
                wrapParams.name,
                wrapParams.symbol,
                wrapParams.underlyingToken, 
                to,
                wrapParams.amount
            );

            emit DestinationWrap(
                _wrapper(
                    any2EvmMessage.sourceChainSelector,
                    any2EvmMessage.sender,
                    wrapParams.underlyingToken
                ),
                any2EvmMessage.messageId
            );
        } else {
            UnwrapParams memory unwrapParams = abi.decode(message.data, (UnwrapParams));

            address underlyingToken = abi.decode(unwrapParams.underlyingToken, (address));
            address to = abi.decode(unwrapParams.to, (address));

            _unwrapTokens(
                underlyingToken, 
                to, 
                unwrapParams.amount
            );

            emit DestinationUnwrap(
                any2EvmMessage.messageId
            );
        }
    }

    function _wrapTokens(
        uint64 sourceChainSelector,
        bytes memory bridglAddress,
        string memory wrappedName,
        string memory wrappedSymbol,
        bytes memory underlyingToken,
        address to,
        uint256 amount
    ) internal {
        address wrappedToken = _wrappedTokens[sourceChainSelector][bridglAddress][underlyingToken];

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
            _wrappedTokens[sourceChainSelector][bridglAddress][underlyingToken] = wrappedToken;

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
        bytes memory bridglAddress,
        bytes memory underlyingToken
    ) internal view returns (address) {
        return _wrappedTokens[chainSelector][bridglAddress][underlyingToken];
    }

    function _wrapperExists(
        uint64 chainSelector,
        bytes memory bridglAddress,
        bytes memory underlyingToken
    ) internal view returns (bool) {
        return _wrapper(chainSelector, bridglAddress, underlyingToken) != address(0);
    }

    function _buildMessage(
        bytes memory bridglAddress,
        bytes memory extraArgs,
        MessageData memory params
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        return
            Client.EVM2AnyMessage({
                receiver: bridglAddress,
                data: abi.encode(params),
                tokenAmounts: new Client.EVMTokenAmount[](0),
                extraArgs: extraArgs,
                feeToken: address(0)
            });
    }
}
