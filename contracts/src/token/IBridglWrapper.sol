// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";

interface IBridglWrapper is IERC20 {
    error UnderlyingIsZeroAddress();
    error UnderlyingIsThisAddress();

    function initialize(
        string memory initName,
        string memory initSymbol,
        uint64 underlyingChainSelector,
        address underlyingToken,
        address initOwner
    ) external;

    function underlying() external view returns (uint64, address);

    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}
