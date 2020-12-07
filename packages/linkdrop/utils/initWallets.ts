import { createWallet, getProvider, initAccount as _initAccount } from "common";
import { MockProvider } from "ethereum-waffle";

export function initWallets(isMock = false) {
  if (isMock) {
    const provider = new MockProvider();

    return {
      provider,
      wallets: provider.getWallets(),
    };
  } else {
    const provider = getProvider();

    return {
      provider,
      wallets: createWallet(provider) as any,
    };
  }
}
