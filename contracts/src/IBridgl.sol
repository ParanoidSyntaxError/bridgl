// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IBridgl {
    error InsufficientFees(uint256 balance, uint256 amount);
    error WrapperDoesNotExist(uint64 chainSelector, address bridgl, address underlyingToken);

    event NewWrapper(
        address indexed underlyingToken,
        address indexed wrapper
    );
    
    event SourceWrap(
        uint64 destinationChainSelector,
        address indexed destinationAddress,
        address indexed underlyingToken,
        address from,
        address to,
        uint256 amount,
        bytes32 messageId
    );

    event DestinationWrap(
        address indexed wrapper,
        bytes32 messageId
    );

    event SourceUnwrap(
        uint64 destinationChainSelector,
        address indexed destinationAddress,
        address indexed underlyingToken,
        address indexed wrapper,
        address from,
        address to,
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
        address underlyingToken;
        address to;
        uint256 amount;
    }

    struct UnwrapParams {
        address underlyingToken;
        address to;
        uint256 amount;
    }
    
    function wrap(
        uint64 destinationChainSelector,
        address destinationAddress,
        address underlyingToken,
        address to,
        uint256 amount
    ) external payable returns (bytes32 messageId);

    function unwrap(
        uint64 destinationChainSelector,
        address destinationAddress,
        address underlyingToken,
        address to,
        uint256 amount
    ) external payable returns (bytes32 messageId);

    function wrapperImplementation() external view returns (address);

    function wrapper(
        uint64 chainSelector,
        address bridgl,
        address underlyingToken
    ) external view returns (address);
}