// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";

import {CCIPLocalSimulator, IRouterClient, LinkToken} from "@chainlink/local/src/ccip/CCIPLocalSimulator.sol";
import {Client} from "@chainlink/contracts/src/v0.8/ccip/libraries/Client.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

import {Bridgl} from "../src/Bridgl.sol";

contract WrapTest is Test {
    CCIPLocalSimulator public ccipLocalSimulator;

    Bridgl public sourceBridgl;
    Bridgl public destinationBridgl;

    LinkToken public link;

    uint64 public destinationChainSelector;

    function setUp() public {
        ccipLocalSimulator = new CCIPLocalSimulator();

        (
            uint64 chainSelector, 
            IRouterClient sourceRouter, 
            IRouterClient destinationRouter,, 
            LinkToken linkToken,,
        ) = ccipLocalSimulator.configuration();

        sourceBridgl = new Bridgl(address(sourceRouter));
        destinationBridgl = new Bridgl(address(destinationRouter));

        link = linkToken;

        destinationChainSelector = chainSelector;
    }

    function test_wrap() public {
        address to = vm.randomAddress();

        ccipLocalSimulator.requestLinkFromFaucet(address(this), 100);
        link.approve(address(sourceBridgl), 100);

        deal(address(sourceBridgl), 1 ether);

        bytes32 messageId = sourceBridgl.wrap(
            destinationChainSelector,
            abi.encode(address(destinationBridgl)),
            Client._argsToBytes(Client.GenericExtraArgsV2(
                10_000_000,
                true
            )),
            address(link),
            abi.encode(to),
            10
        );

        console.logBytes32(messageId);

        address wrapper = destinationBridgl.wrapper(
            destinationChainSelector, 
            abi.encode(address(sourceBridgl)), 
            abi.encode(address(link))
        );
        console.logAddress(wrapper);
        console.logUint(IERC20(wrapper).balanceOf(to));

        console.logString(IERC20Metadata(wrapper).name());
        console.logString(IERC20Metadata(wrapper).symbol());
    }
}