/* eslint-disable import/order */
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(path.join(__dirname, "../.env")) });
import fs from "fs";

import { InvalidArgumentError, program } from "commander";
import * as kleur from "kleur";
import { TezosOperationError } from "@taquito/taquito";
import { PACKAGE_JSON_FILE_PATH } from "./configuration";
import { generateContractMetadata } from "./generate-contract-metadata";
import { compileContract } from "./compile-contract";
import { compileOffChainViews } from "./compile-off-chain-views";
import { pinToken0Asset } from "./pin-token-0-asset";
import { generateToken0Metadata } from "./generate-token-0-metadata";
import { pinToken0Metadata } from "./pin-token-0-metadata";
import { originateContract } from "./originate-contract";
import { pinContractMetadata } from "./pin-contract-metadata";
import { startSandbox } from "./start-sandbox";
import { stopSandbox } from "./stop-sandbox";
import { mint } from "./mint";
import { checkTezosConfig } from "./get-tezos-toolkit";
import { CONTRACT_RELIGO_SYNTAX, CONTRACT_SYNTAXES } from "./configuration";
const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_FILE_PATH).toString());

// configuration

program.version(packageJson.version);

//prettier-ignore
program
  .command("check-tezos-config")
  .alias("ctc")
  .description("checks rpc url and signer credentials")
  .action(checkTezosConfig);

//prettier-ignore
program
  .command("start-sandbox")
  .alias("starts")
  .description("starts local sandbox tezos blockchain using docker")
  .action(startSandbox);

//prettier-ignore
program
  .command("stop-sandbox")
  .alias("stops")
  .description("stops local sandbox tezos blockchain using docker")
  .action(stopSandbox);

const validateSyntax = (value: string) => {
  if (!Object.keys(CONTRACT_SYNTAXES).includes(value)) {
    throw new InvalidArgumentError("Not supported syntax");
  }
  return value;
};

//prettier-ignore
program
  .command('compile-contract')
  .alias('cc')
  .description('compiles contract into tz and json format')
  .argument('[syntax]', 'contract syntax to compile', validateSyntax, CONTRACT_RELIGO_SYNTAX)
  .action(compileContract);

//prettier-ignore
program
  .command("compile-off-chain-views")
  .alias("cocv")
  .description("compiles contract and export json code for certain (off-chain view) functions")
  .argument('[syntax]', 'contract syntax to compile', validateSyntax, CONTRACT_RELIGO_SYNTAX)
  .action(compileOffChainViews);

//prettier-ignore
program
  .command('generate-contract-metadata')
  .alias('gcm')
  .description('generates contract metadata json file')
  .action(generateContractMetadata);

//prettier-ignore
program
  .command("pin-contract-metadata")
  .alias("pcm")
  .description("pins contract metadata to IPFS using Pinata and saves info into json file")
  .action(pinContractMetadata);

//prettier-ignore
program
  .command('pin-token-0-asset')
  .alias('pt0a')
  .description('pins token 0 asset to IPFS using Pinata and saves info into json file')
  .action(pinToken0Asset);

//prettier-ignore
program
  .command('generate-token-0-metadata')
  .alias('gt0m')
  .description('generates token 0 metadata json file')
  .action(generateToken0Metadata);

//prettier-ignore
program
  .command("pin-token-0-metadata")
  .alias("pt0m")
  .description("pins token 0 metadata to IPFS using Pinata and saves info into json file")
  .action(pinToken0Metadata);

//prettier-ignore
program
  .command("originate-contract")
  .alias("oc")
  .description("originates contract and saved a json file with important info")
  .action(originateContract);

//prettier-ignore
program
  .command("mint")
  .alias("m")
  .description("minting a token")
  .argument("<token-id>", "token id that will be minted (integer)", parseInteger)
  .argument("<to-account>", "the account that will become the owner of the minted token")
  .action((tokenId: number, toAccount: string) => mint({ tokenId, toAccount }));

program.parseAsync().catch((error) => {
  if (typeof error === "string") console.log(kleur.red(error));
  else if (error instanceof TezosOperationError) {
    console.log(kleur.red(`Tezos operation error: ${kleur.bold(error.message)}`));
  } else {
    console.log(kleur.red("unknown error:"));
    console.log(error);
  }
});

function parseInteger(value: string): number {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) throw new InvalidArgumentError("Not an integer");
  return parsedValue;
}
