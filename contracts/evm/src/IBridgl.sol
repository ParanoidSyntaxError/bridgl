// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IBridgl {
    error InsufficientFees(uint256 balance, uint256 amount);
    error WrapperDoesNotExist(uint64 chainSelector, bytes bridglAddress, bytes underlyingToken);

    event NewWrapper(
        bytes indexed underlyingToken,
        address indexed wrapper
    );
    
    event SourceWrap(
        uint64 destinationChainSelector,
        bytes indexed bridglAddress,
        address indexed underlyingToken,
        address from,
        bytes to,
        uint256 amount,
        bytes32 messageId
    );

    event DestinationWrap(
        address indexed wrapper,
        bytes32 messageId
    );

    event SourceUnwrap(
        uint64 destinationChainSelector,
        bytes indexed bridglAddress,
        bytes indexed underlyingToken,
        address indexed wrapper,
        address from,
        bytes to,
        uint256 amount,
        bytes32 messageId
    );

    event DestinationUnwrap(
        bytes32 messageId
    );
    
    struct MessageData {
        uint8 selector; // 0: wrap, 1: unwrap
        bytes data;
    }

    struct WrapParams {
        string name;
        string symbol;
        bytes underlyingToken;
        bytes to;
        uint256 amount;
    }

    struct UnwrapParams {
        bytes underlyingToken;
        bytes to;
        uint256 amount;
    }
    
    function wrap(
        uint64 destinationChainSelector,
        bytes memory bridglAddress,
        bytes memory extraArgs,
        address underlyingToken,
        bytes memory to,
        uint256 amount
    ) external payable returns (bytes32 messageId);

    function unwrap(
        uint64 destinationChainSelector,
        bytes memory bridglAddress,
        bytes memory extraArgs,
        bytes memory underlyingToken,
        bytes memory to,
        uint256 amount
    ) external payable returns (bytes32 messageId);

    function wrapperImplementation() external view returns (address);

    function wrapper(
        uint64 chainSelector,
        bytes memory bridglAddress,
        bytes memory underlyingToken
    ) external view returns (address);
}