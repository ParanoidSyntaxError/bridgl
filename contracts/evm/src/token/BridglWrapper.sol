// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20, IERC20, IERC20Metadata} from "@openzeppelin/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/proxy/utils/Initializable.sol";
import {Ownable} from "@openzeppelin/access/Ownable.sol";

import {IBridglWrapper} from "./IBridglWrapper.sol";

contract BridglWrapper is ERC20, Initializable, Ownable, IBridglWrapper {
    string private _name;
    string private _symbol;

    uint64 private _underlyingChainSelector;
    address private _underlyingToken;

    constructor() ERC20("", "") Ownable(address(1)) {}

    function initialize(
        string memory initName,
        string memory initSymbol,
        uint64 underlyingChainSelector,
        address underlyingToken,
        address initOwner
    ) external override initializer {
        if (underlyingToken == address(0)) {
            revert UnderlyingIsZeroAddress();
        }
        if (underlyingToken == address(this)) {
            revert UnderlyingIsThisAddress();
        }

        _name = initName;
        _symbol = initSymbol;

        _underlyingChainSelector = underlyingChainSelector;
        _underlyingToken = underlyingToken;

        _transferOwnership(initOwner);
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function underlying() external view override returns (uint64, address) {
        return (_underlyingChainSelector, _underlyingToken);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
