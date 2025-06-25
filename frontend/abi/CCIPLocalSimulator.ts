export const CCIPLocalSimulatorAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "configuration",
    "inputs": [],
    "outputs": [
      {
        "name": "chainSelector_",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "sourceRouter_",
        "type": "address",
        "internalType": "contract IRouterClient"
      },
      {
        "name": "destinationRouter_",
        "type": "address",
        "internalType": "contract IRouterClient"
      },
      {
        "name": "wrappedNative_",
        "type": "address",
        "internalType": "contract WETH9"
      },
      {
        "name": "linkToken_",
        "type": "address",
        "internalType": "contract LinkToken"
      },
      {
        "name": "ccipBnM_",
        "type": "address",
        "internalType": "contract BurnMintERC677Helper"
      },
      {
        "name": "ccipLnM_",
        "type": "address",
        "internalType": "contract BurnMintERC677Helper"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSupportedTokens",
    "inputs": [
      {
        "name": "chainSelector",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isChainSupported",
    "inputs": [
      {
        "name": "chainSelector",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "supported",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "requestLinkFromFaucet",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "success",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportNewTokenViaAccessControlDefaultAdmin",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportNewTokenViaGetCCIPAdmin",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportNewTokenViaOwner",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "error",
    "name": "CCIPLocalSimulator__MsgSenderIsNotTokenOwner",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CCIPLocalSimulator__RequiredRoleNotFound",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;