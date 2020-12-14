import { options } from "@acala-network/api";
import { Provider } from "@acala-network/bodhi";
import { WsProvider } from "@polkadot/api";

export function getProvider() {
  return new Provider(
    options({
      provider: new WsProvider("ws://localhost:9944")
    })
  );
}
