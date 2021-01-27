import { Provider, Wallet } from "@acala-network/bodhi";
import { randomBytes } from "@ethersproject/random";
import { Wallet as EthersWallet } from "@ethersProject/wallet";
import { Keyring } from "@polkadot/keyring";
import { u8aToHex } from "@polkadot/util";

export function createWallet(provider: Provider, numbers = 5) {
  const wallets = [];

  for (let i = 0; i < numbers; i++) {
    const wallet = EthersWallet.createRandom();
    wallets.push(wallet);
  }

  const keyring = new Keyring();

  return wallets.map((wallet) => {
    const pair = keyring.createFromUri(u8aToHex(randomBytes(32)));
    return new Wallet(provider, pair, wallet);
  });
}

// export function getWallets(provider: Provider) {
//   const wallets = [
//     "0xaa397267eaee48b2262a973fdcab384a758f39a3ad8708025cfb675bb9effc20",
//     "0x89a3bbcccd076b53051f391989b5fab75e8caee2d6a3faaf73be2fbedf3fa722",
//     "0x62f1c70913a68196a469204786830589e37ca745c6d16fb7ac7199b4a94f6125",
//     "0xafed3ffe3f9cc01db760ae859ca67880ab53cdfd9e00db695a9aab22f35b9a23",
//     "0x285cedaa67b59620a031c37f395abe459dbdff4e12a45a89a69d6627cbfe9324",
//     "0xcc0bec3f4f4d6e086e31c06838394d5c810d5e1923da76e0d2711ed01bc7db24",
//     "0x54bfdf95b6a246d0be0ce5f3d79bba15b30916e1dd4c68ba0e2051ef3199e62b",
//   ];

//   return wallets.map((wallet) => {
//     return new Wallet(wallet, provider);
//   });
// }
