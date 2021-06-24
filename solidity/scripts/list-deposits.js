const web3Utils = require("web3-utils")

const Deposit = artifacts.require('Deposit')
const DepositToken = artifacts.require('TBTCDepositToken')
const VendingMachine = artifacts.require('VendingMachine')

const { toBN, padLeft } = web3Utils

const States = {
  // DOES NOT EXIST YET
  START: 0,

  // FUNDING FLOW
  AWAITING_SIGNER_SETUP: 1,
  AWAITING_BTC_FUNDING_PROOF: 2,

  // FAILED SETUP
  FAILED_SETUP: 3,

  // ACTIVE
  ACTIVE: 4,  // includes courtesy call

  // REDEMPTION FLOW
  AWAITING_WITHDRAWAL_SIGNATURE: 5,
  AWAITING_WITHDRAWAL_PROOF: 6,
  REDEEMED: 7,

  // SIGNER LIQUIDATION FLOW
  COURTESY_CALL: 8,
  FRAUD_LIQUIDATION_IN_PROGRESS: 9,
  LIQUIDATION_IN_PROGRESS: 10,
  LIQUIDATED: 11
}

const StatesList = {}

for (const key in States) {
  if (States[key]) {
    StatesList[States[key]] = key
  }
}

const getExistingEvents = async (sourceContract, eventName, filter, fromBlock) => {
  const events = await sourceContract.getPastEvents(eventName, {
    fromBlock: fromBlock || sourceContract.deployedAtBlock || 0,
    toBlock: "latest",
    filter
  })

  return events
}

const DEPOSIT_OWNER_ADDRESS = "0xD6b0a1CA8f0641B97eFeC0F1eD73d72e58b38FA5"

const run = async () => {
  const depositToken = await DepositToken.deployed()

  try {
    const ownedDepositTokens = (
      await getExistingEvents(
        depositToken,
        "Transfer",
        // { to: "" } // list all deposits
        { to: DEPOSIT_OWNER_ADDRESS || "" } // list deposits that were transfered to DEPOSIT_OWNER_ADDRESS
      )
    )
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .map((event) => (event.returnValues.tokenId))

    const stillOwned = await Promise.all(
      ownedDepositTokens.map(tokenId =>
        depositToken.ownerOf(tokenId)
          .then((address) => {
            const depositAddress = padLeft("0x" + toBN(tokenId).toString("hex"), 40)
            const ownerAddress = address === DEPOSIT_OWNER_ADDRESS
              ? "deposit owner"
              : address === VendingMachine.address
                ? "vending machine"
                : `other: ${address}`

            return [depositAddress, ownerAddress]
          })
      )
    )

    const deposits = await Promise.all(
      stillOwned.map(([depositAddress]) => {
        return Deposit.at(depositAddress)
      })
    )

    const fulldepositsInfo = (
      await Promise.all(
        deposits.map((deposit) => {
          const lotSize = deposit.lotSizeSatoshis()
          const status = deposit.currentState()

          return Promise.all([lotSize, status])
        })
      )
    )
      .map((depositDetails, index) => {
        const [lotSize, status] = depositDetails
        const [tdtId, owned] = stillOwned[index]

        return {
          tdtId,
          owned,
          status: StatesList[status.toNumber()],
          lotSize: lotSize.toNumber() / (10 ** 8)
        }
      })

    const depositsById = {}

    for (const depositInfo of [...fulldepositsInfo].reverse()) {
      depositsById[depositInfo.tdtId] = depositInfo
    }

    console.log(Object.values(depositsById))

    process.exit(0)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

module.exports = run
