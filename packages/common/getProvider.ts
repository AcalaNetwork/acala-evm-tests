import { options } from "@acala-network/api";
import { Provider } from "@acala-network/bodhi";
import { DataProvider } from "@acala-network/bodhi/DataProvider";
import { WsProvider } from "@polkadot/api";
import { Sequelize } from "sequelize";

export function getProvider() {
  const db = new Sequelize(
    "postgres://postgres:postgres@192.168.1.10:5432/postgres",
    {
      logging: false,
    }
  );

  const dataProvider = new DataProvider(db);

  return new Provider(
    options({
      provider: new WsProvider("ws://192.168.1.10:9944"),
      types: {
        EvmAddress: "H160",
        CallRequest: {
          from: "Option<H160>",
          to: "Option<H160>",
          gasLimit: "Option<u32>",
          value: "Option<U128>",
          data: "Option<Bytes>",
        },
        ExitReason: {
          _enum: {
            Succeed: "ExitSucceed",
            Error: "ExitError",
            Revert: "ExitRevert",
            Fatal: "ExitFatal",
          },
        },
        ExitSucceed: {
          _enum: ["Stopped", "Returned", "Suicided"],
        },
        ExitError: {
          _enum: {
            StackUnderflow: "Null",
            StackOverflow: "Null",
            InvalidJump: "Null",
            InvalidRange: "Null",
            DesignatedInvalid: "Null",
            CallTooDeep: "Null",
            CreateCollision: "Null",
            CreateContractLimit: "Null",
            OutOfOffset: "Null",
            OutOfGas: "Null",
            OutOfFund: "Null",
            PCUnderflow: "Null",
            CreateEmpty: "Null",
            Other: "Text",
          },
        },
        ExitRevert: {
          _enum: ["Reverted"],
        },
        ExitFatal: {
          _enum: {
            NotSupported: "Null",
            UnhandledInterrupt: "Null",
            CallErrorAsFatal: "ExitError",
            Other: "Text",
          },
        },
      },
      rpc: {
        evm: {
          call: {
            description: "eth call",
            params: [
              {
                name: "data",
                type: "CallRequest",
              },
              {
                name: "at",
                type: "BlockHash",
                isHistoric: true,
                isOptional: true,
              },
            ],
            type: "Raw",
          },
          estimateGas: {
            description: "eth estimateGas",
            params: [
              {
                name: "data",
                type: "CallRequest",
              },
              {
                name: "at",
                type: "BlockHash",
                isHistoric: true,
                isOptional: true,
              },
            ],
            type: "u128",
          },
        },
      },
    }),
    dataProvider
  );
}
