import Indexer from "@open-web3/indexer";
import { types, typesBundle } from "@acala-network/type-definitions"

const run = async () => {
  const dbUrl = "postgres://postgres:postgres@127.0.0.1:5432/postgres";
  const wsUrl = "ws://127.0.0.1:9944";

  const indexer = await Indexer.create({
    dbUrl,
    wsUrl,
    types: {
      'EvmAddress': 'H160',
      ExitReason: {
        _enum: {
          Succeed: 'ExitSucceed',
          Error: 'ExitError',
          Revert: 'ExitRevert',
          Fatal: 'ExitFatal',
        }
      },
      ExitSucceed: {
        _enum: ['Stopped', 'Returned', 'Suicided']
      },
      ExitError: {
        _enum: {
          StackUnderflow: 'Null',
          StackOverflow: 'Null',
          InvalidJump: 'Null',
          InvalidRange: 'Null',
          DesignatedInvalid: 'Null',
          CallTooDeep: 'Null',
          CreateCollision: 'Null',
          CreateContractLimit: 'Null',
          OutOfOffset: 'Null',
          OutOfGas: 'Null',
          OutOfFund: 'Null',
          PCUnderflow: 'Null',
          CreateEmpty: 'Null',
          Other: 'Text',
        }
      },
      ExitRevert: {
        _enum: ['Reverted']
      },
      ExitFatal: {
        _enum: {
          NotSupported: 'Null',
          UnhandledInterrupt: 'Null',
          CallErrorAsFatal: 'ExitError',
          Other: 'Text',
        }
      },
      ...types,
    },
    typesBundle,
    sync: true,
  });

  await indexer.start({
    concurrent: 1,
    confirmation: 1
  });
};

run().catch((err) => {
  console.error(err);
});
