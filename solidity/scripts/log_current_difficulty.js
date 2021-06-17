/* global artifacts */

const Relay = artifacts.require('TestnetRelay');

module.exports = async () => {
  const relay = await Relay.deployed()
  const currentDifficulty = await relay.getCurrentEpochDifficulty()
  const prevDifficulty = await relay.getPrevEpochDifficulty()
  console.log({
    currentDifficulty: currentDifficulty.toString(),
    prevDifficulty: prevDifficulty.toString()
   })
}
