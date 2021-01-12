const {createSnapshot, restoreSnapshot} = require("./helpers/snapshot.js")
const {contract, accounts} = require("@openzeppelin/test-environment")
const {BN} = require("@openzeppelin/test-helpers")
const bnChai = require("bn-chai")
const {expect} = require("chai").use(bnChai(BN))

const SatWeiPriceFeed = contract.fromArtifact("SatWeiPriceFeed")
const MockPriceOracle = contract.fromArtifact("MockPriceOracle")

describe("SatWeiPriceFeed", async function() {
  let satWeiPriceFeed
  let btcsov

  before(async () => {
    btcsov = await MockPriceOracle.new()
    satWeiPriceFeed = await SatWeiPriceFeed.new()

    await satWeiPriceFeed.initialize(accounts[0], btcsov.address)
  })

  describe("#getPrice", async () => {
    beforeEach(async () => await createSnapshot())
    afterEach(async () => await restoreSnapshot())

    it("returns correct satwei price feed value", async () => {
      const btcusd = new BN(7000)
      // multiplication before division since BN does not store decimal points
      // oracle returns price * 1e8
      await btcsov.setValue(btcusd.mul(new BN(1e8)))
      const price = await satWeiPriceFeed.getPrice.call({from: accounts[0]})
      expect(new BN(price)).to.eq.BN(btcusd.mul(new BN(1e8)))
    })
  })

})
