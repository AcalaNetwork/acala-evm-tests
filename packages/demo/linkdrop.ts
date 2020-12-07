import LinkdropFactory from "linkdrop/build/LinkdropFactory.json";
import LinkdropMastercopy from "linkdrop/build/LinkdropMastercopy.json";
import ERC20 from "linkdrop/build/ERC20.json";

import { ethers } from "ethers";

import { createWallet, getProvider, initAccount } from "common";
import {
  computeProxyAddress,
  createLink,
  signReceiverAddress,
  computeBytecode,
} from "linkdrop/scripts/utils";

const DOT = '0x0000000000000000000000000000000000000802'
const chainId = 595
const initcode = "0x6352c7420d6000526103ff60206004601c335afa6040516060f3"

const main = async () => {
  const provider = getProvider()

  const wallets = createWallet(provider) as any

  await initAccount(provider, wallets)

  let [linkdropMaster, linkdropSigner, receiverAddress] = wallets

  const tokenInstance = new ethers.Contract(
    DOT,
    ERC20.abi,
    linkdropMaster
  )

  const bal = await tokenInstance.balanceOf(linkdropMaster.address)
  console.log(bal.toString())

  const masterCopy = await deployContract(linkdropMaster, LinkdropMastercopy, [], {
    gasLimit: 300_000_000,
  });

  const bytecode = computeBytecode(masterCopy.address);
  const factory = await deployContract(
    linkdropMaster,
    LinkdropFactory,
    [masterCopy.address, chainId],
    {
      gasLimit: 300_000_000,
    }
  );

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
    receiverAddress
  );
}

main().then(() => process.exit(0))
