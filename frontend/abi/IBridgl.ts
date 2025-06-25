export const IBridglAbi = [
  {
    "type": "function",
    "name": "unwrap",
    "inputs": [
      {
        "name": "destinationChainSelector",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "bridglAddress",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "extraArgs",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "underlyingToken",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "to",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "messageId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "wrap",
    "inputs": [
      {
        "name": "destinationChainSelector",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "bridglAddress",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "extraArgs",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "underlyingToken",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "messageId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "wrapper",
    "inputs": [
      {
        "name": "chainSelector",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "bridglAddress",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "underlyingToken",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "wrapperImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "DestinationUnwrap",
    "inputs": [
      {
        "name": "messageId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DestinationWrap",
    "inputs": [
      {
        "name": "wrapper",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "messageId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NewWrapper",
    "inputs": [
      {
        "name": "underlyingToken",
        "type": "bytes",
        "indexed": true,
        "internalType": "bytes"
      },
      {
        "name": "wrapper",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SourceUnwrap",
    "inputs": [
      {
        "name": "destinationChainSelector",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "bridglAddress",
        "type": "bytes",
        "indexed": true,
        "internalType": "bytes"
      },
      {
        "name": "underlyingToken",
        "type": "bytes",
        "indexed": true,
        "internalType": "bytes"
      },
      {
        "name": "wrapper",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "messageId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SourceWrap",
    "inputs": [
      {
        "name": "destinationChainSelector",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "bridglAddress",
        "type": "bytes",
        "indexed": true,
        "internalType": "bytes"
      },
      {
        "name": "underlyingToken",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "messageId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "InsufficientFees",
    "inputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "WrapperDoesNotExist",
    "inputs": [
      {
        "name": "chainSelector",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "bridglAddress",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "underlyingToken",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  }
] as const;