import * as testingPairs from "@polkadot/keyring/testingPairs";

export function transfer(api, signer, address, amount) {
  return new Promise((resolve, reject) => {
    api.tx.balances.transfer(address, amount).signAndSend(signer, (result) => {
      if (result.status.isFinalized || result.status.isInBlock) {
        resolve();
      } else if (result.isError) {
        reject();
      }
    });
  });
}

export async function initWallet(
  wallets,
  amount = 10_000_000_000_000_000_000_000n
) {
  const pairs = testingPairs.createTestPairs();
  const api = wallets[0].provider.api;

  await api.isReady;

  for (const wallet of wallets) {
    await wallet.provider.init();
    await transfer(api, pairs.alice, wallet.keyringPair.address, amount);
    await wallets.claimEvmAccounts();
  }

  console.log("init success");
}
