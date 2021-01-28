import * as a from "crypto"
import {ethers} from "ethers"

const provider = new ethers.providers.JsonRpcProvider(
  // "https://public-node.testnet.rsk.co"
  "https://testnet.sovryn.app/rpc",
  // "https://mainnet.infura.io/v3/c2b2337d3feb4c46ac3594e105176258"
  // "http://localhost:4444"
)
// console.log(provider)

const oracleAddress = "0x0A6858f2E0f2b42DbDD21D248DA589478c507Cdd".toLowerCase()
const main = async () => {
  // console.log(await provider.getNetwork())
  // console.log(await provider.getCode(oracleAddress))
  // const oracle1 = new AggregatorV3Interface(
  //   "0x0A6858f2E0f2b42DbDD21D248DA589478c507Cdd".toLowerCase(),
  //   compilerOutput.abi,
  //   provider,
  // )
  const oracle = new ethers.Contract(
    oracleAddress,
    abi,
    provider,
  )
  console.log((await oracle.latestAnswer()))
  console.log((await oracle.latestAnswer()).toString())
}
const abi = [
  {
    constant: false,
    inputs: [{name: "_mocOracleAddress", type: "address"}],
    name: "setMoCOracleAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "latestAnswer",
    outputs: [{name: "", type: "int256"}],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "latestTimestamp",
    outputs: [{name: "", type: "uint256"}],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{name: "", type: "address"}],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{name: "", type: "address"}],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "mocOracleAddress",
    outputs: [{name: "", type: "address"}],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{name: "_newOwner", type: "address"}],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{name: "_mocOracleAddress", type: "address"}],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: "mocOracleAddress", type: "address"},
      {indexed: false, name: "changerAddress", type: "address"},
    ],
    name: "SetMoCOracleAddress",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: "_prevOwner", type: "address"},
      {indexed: true, name: "_newOwner", type: "address"},
    ],
    name: "OwnerUpdate",
    type: "event",
  },
]
main()

