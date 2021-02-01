// Configuration for addresses of externally deployed smart contracts
// prettier-ignore
const BondedECDSAKeepFactoryAddress = "0xd91f6705fae8e903a98c2A08Fa51fb5AA55c92a6"

// Medianized price feeds.
// These are deployed and maintained by Maker.
// See: https://github.com/makerdao/oracles-v2#live-mainnet-oracles

// addresses for sake of local network
const ETHBTCMedianizer = "0x0A6858f2E0f2b42DbDD21D248DA589478c507Cdd" // New oracle

const RopstenETHBTCPriceFeed = "0xD26baCcD39D6bbC847303A4db021Fd2F0481B33d"

module.exports = {
  BondedECDSAKeepFactoryAddress,
  ETHBTCMedianizer,
  RopstenETHBTCPriceFeed,
}
