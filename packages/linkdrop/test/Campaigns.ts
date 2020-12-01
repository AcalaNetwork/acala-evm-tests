/* global describe, before, it */

import chai from "chai";
import { ethers } from "ethers";

import { deployContract, solidity } from "ethereum-waffle";
import { initWallets } from "../utils/initWallets";
import { initAccount } from "common";

import LinkdropFactory from "../build/LinkdropFactory.json";
import LinkdropMastercopy from "../build/LinkdropMastercopy.json";
import TokenMock from "../build/TokenMock.json";
import { supportEmit } from "../utils/hackEmit";

import { computeProxyAddress, computeBytecode } from "../scripts/utils";

chai.use(solidity);
chai.use(function waffleChai(chai, utils) {
  supportEmit(chai.Assertion);
});

const { expect } = chai;

let { provider, wallets } = initWallets((process.env as any).MOCK);

let [deployer, linkdropMaster, linkdropSigner, relayer] = wallets;

let masterCopy;
let factory;
let proxy;
let proxyAddress;
let tokenInstance;

let link;
let receiverAddress;
let receiverSignature;
let weiAmount;
let tokenAddress;
let tokenAmount;
let expirationTime;
let version;
let bytecode;

let campaignId;
let standardFee;

const initcode = "0x6352c7420d6000526103ff60206004601c335afa6040516060f3";
const chainId = 4; // Rinkeby

describe("Campaigns tests", () => {
  before(async () => {
    if (!(process.env as any).MOCK) {
      await initAccount(provider, wallets);
    }
    tokenInstance = await deployContract(linkdropMaster, TokenMock);
  });

  it("should deploy master copy of linkdrop implementation", async () => {
    masterCopy = await deployContract(linkdropMaster, LinkdropMastercopy, [], {
      gasLimit: 3_000_000_000,
    });
    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero);
  });

  it("should deploy factory", async () => {
    bytecode = computeBytecode(masterCopy.address);
    factory = await deployContract(
      deployer,
      LinkdropFactory,
      [masterCopy.address, chainId],
      {
        gasLimit: 3_000_000_000,
      }
    );
    expect(factory.address).to.not.eq(ethers.constants.AddressZero);
    let version = await factory.masterCopyVersion();
    expect(version).to.eq(1);
    factory = factory.connect(relayer);
  });

  it("should deploy proxy for the first campaign with signing key", async () => {
    factory = factory.connect(linkdropMaster);
    campaignId = 0;

    // Compute next address with js function
    let expectedAddress = computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      campaignId,
      initcode
    );

    await expect(
      factory.deployProxyWithSigner(campaignId, linkdropSigner.address, {
        gasLimit: 3_000_000_000,
      })
    ).to.emit(factory, "Deployed");

    proxy = new ethers.Contract(
      expectedAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    );

    let linkdropMasterAddress = await proxy.linkdropMaster();
    expect(linkdropMasterAddress).to.eq(linkdropMaster.address);

    let version = await proxy.version();
    expect(version).to.eq(1);

    let owner = await proxy.owner();
    expect(owner).to.eq(factory.address);

    let isSigner = await proxy.isLinkdropSigner(linkdropSigner.address);
    expect(isSigner).to.eq(true);
  });

  it("should deploy proxy for the second campaign", async () => {
    factory = factory.connect(linkdropMaster);
    campaignId = 1;

    // Compute next address with js function
    let expectedAddress = computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      campaignId,
      initcode
    );

    await expect(
      factory.deployProxy(campaignId, {
        gasLimit: 3_000_000_000,
      })
    ).to.emit(factory, "Deployed");

    proxy = new ethers.Contract(
      expectedAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    );

    let linkdropMasterAddress = await proxy.linkdropMaster();
    expect(linkdropMasterAddress).to.eq(linkdropMaster.address);

    let version = await proxy.version();
    expect(version).to.eq(1);

    let owner = await proxy.owner();
    expect(owner).to.eq(factory.address);
  });

  it("should deploy proxy for the third campaign", async () => {
    factory = factory.connect(linkdropMaster);
    campaignId = 2;

    // Compute next address with js function
    let expectedAddress = computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      campaignId,
      initcode
    );

    await expect(
      factory.deployProxy(campaignId, {
        gasLimit: 3_000_000_000,
      })
    ).to.emit(factory, "Deployed");

    proxy = new ethers.Contract(
      expectedAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    );

    let linkdropMasterAddress = await proxy.linkdropMaster();
    expect(linkdropMasterAddress).to.eq(linkdropMaster.address);

    let version = await proxy.version();
    expect(version).to.eq(1);

    let owner = await proxy.owner();
    expect(owner).to.eq(factory.address);
  });
});
