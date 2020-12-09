import LinkdropFactory from "linkdrop/build/LinkdropFactory.json";
import LinkdropMastercopy from "linkdrop/build/LinkdropMastercopy.json";
import ERC20 from "linkdrop/build/ERC20.json";

import { ethers, ContractFactory, Signer } from "ethers";

import { createWallet, getProvider, initAccount } from "common";
import {
  computeProxyAddress,
  createLink,
  signReceiverAddress,
} from "linkdrop/scripts/utils";

const DOT = '0x0000000000000000000000000000000000000802'
const chainId = 595
const initcode = "0x6352c7420d6000526103ff60206004601c335afa6040516060f3"

const deployContract = (signer: Signer, contract: any, ...args: any[]) => {
return ContractFactory.fromSolidity(contract).connect(signer).deploy(...args)
}

const main = async () => {
  const provider = getProvider()

  const wallets = createWallet(provider) as any

  await initAccount(provider, wallets)

  let [linkdropMaster, linkdropSigner, receiver] = wallets

  const tokenInstance = new ethers.Contract(
    DOT,
    ERC20.abi,
    linkdropMaster
  )

  const bal = await tokenInstance.balanceOf(linkdropMaster.address)
  console.log(bal.toString())

  const masterCopy = await deployContract(linkdropMaster, LinkdropMastercopy);

  console.log(masterCopy.address)

  const factory = await deployContract(
    linkdropMaster,
    LinkdropFactory,
    masterCopy.address, chainId,
    {
      gasLimit: 300_000_000,
    }
  );

  console.log(factory.address)

  const campaignId = 0;

  // Compute next address with js function
  let expectedAddress = computeProxyAddress(
    factory.address,
    linkdropMaster.address,
    campaignId,
    initcode
  )

  factory.deployProxyWithSigner(campaignId, linkdropSigner.address, {
    gasLimit: 300_000_000,
  })

  const proxy = new ethers.Contract(
    expectedAddress,
    LinkdropMastercopy.abi,
    linkdropMaster
  )

  const link = await createLink(
    linkdropSigner,
    0,
    tokenInstance.address,
    ethers.utils.parseEther('2'),
    1000,
    1,
    chainId,
    proxy.address
  );

  console.log(link)

  const receiverSignature = await signReceiverAddress(
    link.linkKey,
    receiver.address
  );

  const approverBalanceBefore = await tokenInstance.balanceOf(
    linkdropMaster.address
  );

  const receiverTokenBalanceBefore = await tokenInstance.balanceOf(receiver.address);

  await factory.claim(
    0,
    tokenInstance.address,
    ethers.utils.parseEther('2'),
    1000,
    link.linkId,
    linkdropMaster.address,
    campaignId,
    link.linkdropSignerSignature,
    receiver.address,
    receiverSignature,
    { gasLimit: 3_000_000_000 }
  );

  const approverBalanceAfter = await tokenInstance.balanceOf(
    linkdropMaster.address
  );

  const receiverTokenBalanceAfter = await tokenInstance.balanceOf(receiver.address);

  console.log({
    approverBalanceBefore: approverBalanceBefore.toString(),
    approverBalanceAfter: approverBalanceAfter.toString(),
    receiverTokenBalanceBefore: receiverTokenBalanceBefore.toString(),
    receiverTokenBalanceAfter: receiverTokenBalanceAfter.toString(),
  })
}

main().then(() => process.exit(0))
