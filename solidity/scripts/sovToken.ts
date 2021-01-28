import * as a from "crypto"
import {BigNumber, ethers, Wallet} from "ethers"
import ABI from "./ABI/ERC20ABI"
const provider = new ethers.providers.JsonRpcProvider(
  "https://testnet.sovryn.app/rpc",
)
// console.log(ABI)

const tokenAddress = "0x04fa98E97A376a086e3BcAB99c076CB249e5740D".toLowerCase()
const wallet = new Wallet(
  "1ca072b881c5a9ad3cff998b45ac83cfc2d356ec76f66b8e16983d65e6256b4f",
  provider,
)
const main = async () => {
  const sovToken = new ethers.Contract(tokenAddress, ABI, wallet)
  console.log(wallet.address)
  const transaction = await sovToken.mint(wallet.address, BigNumber.from(10).pow(22))
  // console.log(await transaction.wait())
  console.log((await sovToken.balanceOf(wallet.address)).toString())
}

main()
