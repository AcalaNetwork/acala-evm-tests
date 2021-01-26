import { options } from "@acala-network/api";
import { Provider } from "@acala-network/bodhi";
import { WsProvider } from "@polkadot/api";

export function getProvider() {
  return new Provider({
    provider: new WsProvider(process.env.WS_URL || "ws://127.0.0.1:9944"),
  });
}
