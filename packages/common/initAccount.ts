import * as testingPairs from "@polkadot/keyring/testingPairs";

export function transfer(api, signer, address, amount) {
  return new Promise<void>((resolve, reject) => {
    api.tx.balances.transfer(address, amount).signAndSend(signer, (result) => {
      if (result.status.isFinalized || result.status.isInBlock) {
        resolve();
      } else if (result.isError) {
        reject();
      }
    });
  });
}

export function transferDOT(api, signer, address, amount) {
  return new Promise<void>((resolve, reject) => {
    api.tx.currencies
      .transfer(address, { Token: "DOT" }, amount)
      .signAndSend(signer, (result) => {
        if (result.status.isFinalized || result.status.isInBlock) {
          resolve();
        } else if (result.isError) {
          reject();
        }
      });
  });
}

export async function initAccount(
  provider,
  wallets,
  amount = 1_000_000_000_000_000_000_000n
) {
  await provider.api.isReady;
  await provider.init();

  const pairs = testingPairs.createTestPairs();

  for (const wallet of wallets) {
    await transfer(
      provider.api,
      pairs.alice,
      wallet.keyringPair.address,
      amount
    );
    await transferDOT(
      provider.api,
      pairs.alice,
      wallet.keyringPair.address,
      amount
    );
    await wallet.claimEvmAccount();
  }
}
