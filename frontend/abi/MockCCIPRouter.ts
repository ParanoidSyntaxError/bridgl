export const MockCCIPRouterAbi = [
  {
    "type": "function",
    "name": "DEFAULT_GAS_LIMIT",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "GAS_FOR_CALL_EXACT_CHECK",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ccipSend",
    "inputs": [
      {
        "name": "destinationChainSelector",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "message",
        "type": "tuple",
        "internalType": "struct Client.EVM2AnyMessage",
        "components": [
          {
            "name": "receiver",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "tokenAmounts",
            "type": "tuple[]",
            "internalType": "struct Client.EVMTokenAmount[]",
            "components": [
              {
                "name": "token",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "feeToken",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "extraArgs",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getFee",
    "inputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Client.EVM2AnyMessage",
        "components": [
          {
            "name": "receiver",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "tokenAmounts",
            "type": "tuple[]",
            "internalType": "struct Client.EVMTokenAmount[]",
            "components": [
              {
                "name": "token",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "feeToken",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "extraArgs",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOnRamp",
    "inputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "onRampAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getSupportedTokens",
    "inputs": [
      {
        "name": "",
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
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "isChainSupported",
    "inputs": [
      {
        "name": "",
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
    "name": "isOffRamp",
    "inputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "routeMessage",
    "inputs": [
      {
        "name": "message",
        "type": "tuple",
        "internalType": "struct Client.Any2EVMMessage",
        "components": [
          {
            "name": "messageId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "sourceChainSelector",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "sender",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "destTokenAmounts",
            "type": "tuple[]",
            "internalType": "struct Client.EVMTokenAmount[]",
            "components": [
              {
                "name": "token",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          }
        ]
      },
      {
        "name": "gasForCallExactCheck",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "gasLimit",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "success",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "retData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "gasUsed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setFee",
    "inputs": [
      {
        "name": "feeAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "MessageExecuted",
    "inputs": [
      {
        "name": "messageId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "sourceChainSelector",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "offRamp",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "calldataHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MsgExecuted",
    "inputs": [
      {
        "name": "success",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "retData",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      },
      {
        "name": "gasUsed",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "InsufficientFeeTokenAmount",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidAddress",
    "inputs": [
      {
        "name": "encodedAddress",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidExtraArgsTag",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidMsgValue",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlyOffRamp",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ReceiverError",
    "inputs": [
      {
        "name": "err",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedDestinationChain",
    "inputs": [
      {
        "name": "destChainSelector",
        "type": "uint64",
        "internalType": "uint64"
      }
    ]
  }
] as const;