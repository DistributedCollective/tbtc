const {createSnapshot, restoreSnapshot} = require("./helpers/snapshot.js")
const {contract, accounts} = require("@openzeppelin/test-environment")
const {BN, expectRevert} = require("@openzeppelin/test-helpers")
const bnChai = require("bn-chai")
const {expect} = require("chai").use(bnChai(BN))

const SatWeiPriceFeed = contract.fromArtifact("SatWeiPriceFeed")
const MockPriceOracle = contract.fromArtifact("MockPriceOracle")

describe("SatWeiPriceFeed", async function() {
  let satWeiPriceFeed
  let btcsov
  const owner = accounts[1]
  const tbtcSystem = accounts[0]
  before(async () => {
    btcsov = await MockPriceOracle.new()
    satWeiPriceFeed = await SatWeiPriceFeed.new({from: owner})

    await satWeiPriceFeed.initialize(tbtcSystem, btcsov.address, {
      from: owner,
    })
  })

  describe("#getPrice", async () => {
    beforeEach(async () => await createSnapshot())
    afterEach(async () => await restoreSnapshot())

    it("returns correct satwei price feed value", async () => {
      const multiplier = new BN(10**8)
      const btcusd = new BN(7000).mul(multiplier)
      const expectedPrice = btcusd.div(multiplier)

      // multiplication before division since BN does not store decimal points
      await btcsov.setValue(btcusd)
      const price = await satWeiPriceFeed.getPrice.call({from: tbtcSystem})
      // oracle returns price in sat 1 BTC = 1e8 sat
      expect(new BN(price)).to.eq.BN(expectedPrice)
    })
  })
  describe("#setOracleAddress", async () => {
    beforeEach(async () => await createSnapshot())
    afterEach(async () => await restoreSnapshot())

    it("setsNewOracleAddress", async () => {
      const multiplier = new BN(10**8)
      const btcusd = new BN(7000).mul(multiplier)
      const expectedPrice = btcusd.div(multiplier)

      await btcsov.setValue(btcusd)
      const price = await satWeiPriceFeed.getPrice.call({from: tbtcSystem})
      expect(new BN(price)).to.eq.BN(expectedPrice)

      // Create new oracle
      const newOracle = await MockPriceOracle.new()
      const newbtcusd = new BN(8000).mul(multiplier)
      const newExpectedPrice = newbtcusd.div(multiplier)
      await newOracle.setValue(newbtcusd)

      // set new oracle in contract
      await satWeiPriceFeed.setOracleAddress.sendTransaction(
        newOracle.address,
        {from: owner},
      )
      const newPrice = await satWeiPriceFeed.getPrice.call({from: tbtcSystem})
      expect(new BN(newPrice)).to.eq.BN(newExpectedPrice)
    })
    it("setsNewOracleAddress - reverts if not owner", async () => {
      const multiplier = new BN(10**8)
      const btcusd = new BN(7000).mul(multiplier)
      const expectedPrice = btcusd.div(multiplier)

      await btcsov.setValue(btcusd, {from: tbtcSystem})
      const price = await satWeiPriceFeed.getPrice.call({from: tbtcSystem})

      expect(new BN(price)).to.eq.BN(expectedPrice)

      // Create new oracle
      const newOracle = await MockPriceOracle.new()
      const newbtcusd = new BN(8000)

      await newOracle.setValue(newbtcusd)
      // set new oracle in contract by not owner
      await expectRevert(
        satWeiPriceFeed.setOracleAddress.sendTransaction(newOracle.address, {
          from: accounts[3],
        }),
        "Ownable: caller is not the owner",
      )
    })
  })
})
