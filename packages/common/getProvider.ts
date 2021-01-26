import { options } from "@acala-network/api";
import { Provider } from "@acala-network/bodhi";
import { WsProvider } from "@polkadot/api";

export function getProvider() {
  return new Provider({
    provider: new WsProvider("ws://192.168.50.10:9944"),
  });
}
