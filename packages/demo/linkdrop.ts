import LinkdropFactory from "linkdrop/build/LinkdropFactory.json";
import LinkdropMastercopy from "linkdrop/build/LinkdropMastercopy.json";
import TokenMock from "linkdrop/build/TokenMock.json";
import ERC20 from "linkdrop/build/ERC20.json";

import { ethers, ContractFactory, Signer } from "ethers";

import { createWallet, getProvider, initAccount } from "common";
import {
  computeProxyAddress,
  createLink,
  signReceiverAddress,
} from "linkdrop/scripts/utils";

const DOT = "0x0000000000000000000000000000000000000802";
const chainId = 595;
const initcode = "0x6352c7420d6000526103ff60206004601c335afa6040516060f3";

const deployContract = (signer: Signer, contract: any, ...args: any[]) => {
  return ContractFactory.fromSolidity(contract)
    .connect(signer)
    .deploy(...args);
};

const main = async () => {
  const provider = getProvider();

  const wallets = createWallet(provider) as any;

  await initAccount(provider, wallets);

  let [linkdropMaster, linkdropSigner, receiver, relayer] = wallets;

  const campaignId = 0;

  // const tokenInstance = await deployContract(linkdropMaster, TokenMock);
  const tokenInstance = new ethers.Contract(
    DOT,
    ERC20.abi,
    linkdropMaster
  )

  const masterCopy = await deployContract(linkdropMaster, LinkdropMastercopy, {
    gasLimit: 3_000_000_000,
  });

  const factory = await deployContract(
    linkdropMaster,
    LinkdropFactory,
    masterCopy.address,
    chainId,
    {
      gasLimit: 3_000_000_000,
    }
  );

  await factory.deployProxy(campaignId, {
    gasLimit: 3_000_000_000,
  });

  const proxy = new ethers.Contract(
    computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      campaignId,
      initcode
    ),
    LinkdropMastercopy.abi,
    linkdropMaster
  );

  await proxy.addSigner(linkdropSigner.address, { gasLimit: 3_000_000_000 });

  await linkdropMaster.sendTransaction({
    to: proxy.address,
    value: ethers.utils.parseEther("2"),
  });

  //////////////////////

  const weiAmount = 0;
  const tokenAddress = tokenInstance.address;
  const tokenAmount = 999;
  const expirationTime = 100000;
  const version = 1;

  await tokenInstance.approve(proxy.address, tokenAmount);

  const link = await createLink(
    linkdropSigner,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    version,
    chainId,
    proxy.address
  );

  const receiverSignature = await signReceiverAddress(
    link.linkKey,
    receiver.address
  );

  const receiverTokenBalanceBefore = await tokenInstance.balanceOf(
    receiver.address
  );

  const approverBalanceBefore = await tokenInstance.balanceOf(
    linkdropMaster.address
  );

  await factory.addRelayer(relayer.address);

  const factoryWithRelayer = factory.connect(relayer);

  console.log({
    linkdropMaster: linkdropMaster.address,
    linkdropSigner: linkdropSigner.address,
    receiver: receiver.address,
    relayer: relayer.address,
    tokenInstance: tokenInstance.address,
    masterCopy: masterCopy.address,
    factory: factory.address,
    proxy: proxy.address,
    link
  })

  await factoryWithRelayer.claim(
    weiAmount,
    tokenAddress,
    tokenAmount,
    100000,
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

  const receiverTokenBalanceAfter = await tokenInstance.balanceOf(
    receiver.address
  );

  console.log({
    approverBalanceBefore: approverBalanceBefore.toString(),
    approverBalanceAfter: approverBalanceAfter.toString(),
    receiverTokenBalanceBefore: receiverTokenBalanceBefore.toString(),
    receiverTokenBalanceAfter: receiverTokenBalanceAfter.toString(),
  });
};

main().then(() => process.exit(0));
