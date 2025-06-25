export const IERC677ReceiverAbi = [
  {
    "type": "function",
    "name": "onTokenTransfer",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;