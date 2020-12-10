import Indexer from "@open-web3/indexer";
import { options } from "@acala-network/api";

const run = async () => {
  const dbUrl = "postgres://postgres:postgres@127.0.0.1:5432/postgres";
  const wsUrl = "ws://127.0.0.1:9944";

  const acalaOptions = options();

  const indexer = await Indexer.create({
    dbUrl,
    wsUrl,
    types: {
      Address: "GenericMultiAddress",
      LookupSource: "GenericMultiAddress",
      ...acalaOptions.types,
    },
    typesAlias: acalaOptions.typesAlias,
    typesSpec: acalaOptions.typesSpec as any,
    typesChain: acalaOptions.typesChain as any,
    typesBundle: acalaOptions.typesBundle as any,
    sync: true,
  });

  await indexer.start({
    concurrent: 1,
    confirmation: 1,
  });
};

run().catch((err) => {
  console.error(err);
});
