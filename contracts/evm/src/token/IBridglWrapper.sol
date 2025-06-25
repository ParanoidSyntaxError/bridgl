// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IBridglWrapper is IERC20 {
    function initialize(
        string memory initName,
        string memory initSymbol,
        uint64 underlyingChainSelector,
        bytes memory underlyingToken,
        address initOwner
    ) external;

    function underlying() external view returns (uint64, bytes memory);

    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}
