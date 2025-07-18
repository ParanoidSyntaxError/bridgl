export const IRouterAbi = [
  {
    "type": "function",
    "name": "getOnRamp",
    "inputs": [
      {
        "name": "destChainSelector",
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
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isOffRamp",
    "inputs": [
      {
        "name": "sourceChainSelector",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "offRamp",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "isOffRamp",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
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
        "name": "retBytes",
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
    "type": "error",
    "name": "OnlyOffRamp",
    "inputs": []
  }
] as const;