import ERC20 from "linkdrop/build/ERC20.json";

import { ethers } from "ethers";

import { createWallet, getProvider, initAccount } from "common";

const DOT = '0x0000000000000000000000000000000000000802'

const main = async () => {
  const provider = getProvider()

  const wallets = createWallet(provider)

  await initAccount(provider, wallets)

  let [alice, bob] = wallets

  const tokenInstance = new ethers.Contract(
    DOT,
    ERC20.abi,
    alice as any
  )

  console.log({
    Alice: alice.address,
    Bob: bob.address
  })

  const logBalance = async () => {
    const bal = await tokenInstance.balanceOf(alice.address)
    console.log('Alice DOT Balance \t', bal.toString())

    const bal2 = await tokenInstance.balanceOf(bob.address)
    console.log('Bob DOT Balance \t', bal2.toString())
  }

  await logBalance()

  console.log('Transfer 1 DOT from Alice to Bob')

  await tokenInstance.transfer(bob.address, ethers.utils.parseEther('1'));

  await logBalance()
}

main().then(() => process.exit(0))
