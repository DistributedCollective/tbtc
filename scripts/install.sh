#!/bin/bash
set -e pipefail

# Dafault inputs.
KEEP_ECDSA_PATH_DEFAULT=$(realpath -m $(dirname $0)/../../keep-ecdsa)

if [[ -z "${DEST_NETWORK}" ]]; then
  echo "DEST_NETWORK env not set. Exiting"
  exit 1
else
  echo "Using network ${DEST_NETWORK}"
fi

if [[ -z "${RELAY_OWNER_ADDRESS}" ]]; then
  echo "RELAY_OWNER_ADDRESS env not set. Exiting"
  exit 1
else
  echo "Relay owner is set to ${RELAY_OWNER_ADDRESS}"
fi

# Read user inputs.
read -p "Enter path to the keep-ecdsa project [$KEEP_ECDSA_PATH_DEFAULT]: " keep_ecdsa_path
KEEP_ECDSA_PATH=$(realpath ${keep_ecdsa_path:-$KEEP_ECDSA_PATH_DEFAULT})

# Run script.
LOG_START='\n\e[1;36m'  # new line + bold + cyan
LOG_END='\n\e[0m'       # new line + reset
DONE_START='\n\e[1;32m' # new line + bold + green
DONE_END='\n\n\e[0m'    # new line + reset

printf "${LOG_START}Starting installation...${LOG_END}"
TBTC_PATH=$(realpath $(dirname $0)/../)
TBTC_SOL_PATH=$(realpath $TBTC_PATH/solidity)
KEEP_ECDSA_SOL_PATH=$(realpath $KEEP_ECDSA_PATH/solidity)
KEEP_ECDSA_SOL_ARTIFACTS_PATH=$(realpath $KEEP_ECDSA_SOL_PATH/build/contracts)

cd $TBTC_SOL_PATH

printf "${LOG_START}Installing NPM dependencies...${LOG_END}"
npm install

printf "${LOG_START}Unlocking ethereum accounts...${LOG_END}"
KEEP_ETHEREUM_PASSWORD=$KEEP_ETHEREUM_PASSWORD \
    npx truffle exec scripts/unlock-eth-accounts.js --network $DEST_NETWORK

printf "${LOG_START}Finding current ethereum network ID...${LOG_END}"

output=$(npx truffle exec ./scripts/get-network-id.js --network $DEST_NETWORK)
NETWORKID=$(echo "$output" | tail -1)
printf "Current network ID: ${NETWORKID}\n"

printf "${LOG_START}Fetching external contracts addresses...${LOG_END}"
KEEP_ECDSA_SOL_ARTIFACTS_PATH=$KEEP_ECDSA_SOL_ARTIFACTS_PATH \
NETWORKID=$NETWORKID \
    ./scripts/lcl-provision-external-contracts.sh

printf "${LOG_START}Migrating contracts...${LOG_END}"
npm run clean
npx truffle compile
npx truffle migrate --reset --network $DEST_NETWORK --relayOwnerAddress $RELAY_OWNER_ADDRESS

printf "${DONE_START}Installation completed!${DONE_END}"
