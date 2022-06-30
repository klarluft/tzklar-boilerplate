import fs from "fs";

import * as kleur from "kleur";
import { ContractMetadata } from "tzklar";

import {
  CONTRACT_METADATA_FILE_NAME,
  CONTRACT_METADATA_FILE_PATH,
  OFF_CHAIN_VIEW_ALL_TOKENS_CODE_FILE_PATH,
  OFF_CHAIN_VIEW_GET_BALANCE_CODE_FILE_PATH,
  OFF_CHAIN_VIEW_IS_OPERATOR_CODE_FILE_PATH,
  OFF_CHAIN_VIEW_TOKEN_METADATA_CODE_FILE_PATH,
  OFF_CHAIN_VIEW_TOTAL_SUPPLY_CODE_FILE_PATH,
} from "./configuration";

/**
 * This function generates contract metadata json file and saves it.
 *
 * What is important is how it is reading and using other previously generated json files with off-chain views code.
 */
export async function generateContractMetadata() {
  /** get_balance */
  console.log(kleur.yellow(`parsing ${kleur.bold(`get_balance`)} off-chain view json file`));
  console.log(kleur.dim(OFF_CHAIN_VIEW_GET_BALANCE_CODE_FILE_PATH));
  console.log("");
  const getBalanceCode = JSON.parse((await fs.promises.readFile(OFF_CHAIN_VIEW_GET_BALANCE_CODE_FILE_PATH)).toString());

  /** total_supply */
  console.log(kleur.yellow(`parsing ${kleur.bold(`total_supply`)} off-chain view json file`));
  console.log(kleur.dim(OFF_CHAIN_VIEW_TOTAL_SUPPLY_CODE_FILE_PATH));
  console.log("");
  const totalSupplyCode = JSON.parse(
    (await fs.promises.readFile(OFF_CHAIN_VIEW_TOTAL_SUPPLY_CODE_FILE_PATH)).toString()
  );

  /** all_tokens */
  console.log(kleur.yellow(`parsing ${kleur.bold(`all_tokens`)} off-chain view json file`));
  console.log(kleur.dim(OFF_CHAIN_VIEW_ALL_TOKENS_CODE_FILE_PATH));
  console.log("");
  const allTokensCode = JSON.parse((await fs.promises.readFile(OFF_CHAIN_VIEW_ALL_TOKENS_CODE_FILE_PATH)).toString());

  /** is_operator */
  console.log(kleur.yellow(`parsing ${kleur.bold(`is_operator`)} off-chain view json file`));
  console.log(kleur.dim(OFF_CHAIN_VIEW_IS_OPERATOR_CODE_FILE_PATH));
  console.log("");
  const isOperatorCode = JSON.parse((await fs.promises.readFile(OFF_CHAIN_VIEW_IS_OPERATOR_CODE_FILE_PATH)).toString());

  /** token_metadata */
  console.log(kleur.yellow(`parsing ${kleur.bold(`token_metadata`)} off-chain view json file`));
  console.log(kleur.dim(OFF_CHAIN_VIEW_TOKEN_METADATA_CODE_FILE_PATH));
  console.log("");
  const tokenMetadataCode = JSON.parse(
    (await fs.promises.readFile(OFF_CHAIN_VIEW_TOKEN_METADATA_CODE_FILE_PATH)).toString()
  );

  const contractMetadata: ContractMetadata = {
    name: "Test Contract",
    description: "Some test contract",
    authors: ["Michal Wrzosek <michal@wrzosek.pl>"],
    homepage: "https://tzklar.com",
    interfaces: ["TZIP-012-1728fcfe", "TZIP-16-21fb73fe", "TZIP-21-1728fcfe"],
    views: [
      {
        name: "get_balance",
        description: "Get balance for some address and token id",
        pure: true,
        implementations: [
          {
            michelsonStorageView: {
              code: getBalanceCode,
              parameter: {
                prim: "pair",
                args: [
                  { prim: "address", annots: ["%owner"] },
                  { prim: "nat", annots: ["%token_id"] },
                ],
              },
              annotations: [
                {
                  name: "owner",
                  description: "account address to check balance for",
                },
                {
                  name: "token_id",
                  description: "token id number that you want to check balance for",
                },
              ],
              returnType: { prim: "nat" },
            },
          },
        ],
      },
      {
        name: "total_supply",
        description: "Get total supply for a given token id",
        pure: true,
        implementations: [
          {
            michelsonStorageView: {
              code: totalSupplyCode,
              returnType: { prim: "nat", annots: ["%supply"] },
              parameter: { prim: "nat", annots: ["%token_id"] },
              annotations: [
                {
                  name: "token_id",
                  description: "Token id that you're checking supply of",
                },
                {
                  name: "supply",
                  description: "Nr of tokens minted for that token id",
                },
              ],
            },
          },
        ],
      },
      {
        name: "all_tokens",
        description: "Get a list of all token ids",
        pure: true,
        implementations: [
          {
            michelsonStorageView: {
              code: allTokensCode,
              returnType: { prim: "list", args: [{ prim: "nat" }] },
            },
          },
        ],
      },
      {
        name: "is_operator",
        description: "Check if a given account can transfer token of a given id owned by some other account",
        pure: true,
        implementations: [
          {
            michelsonStorageView: {
              code: isOperatorCode,
              parameter: {
                prim: "pair",
                args: [
                  { prim: "address", annots: ["%owner"] },
                  {
                    prim: "pair",
                    args: [
                      { prim: "address", annots: ["%operator"] },
                      { prim: "nat", annots: ["%token_id"] },
                    ],
                  },
                ],
              },
              returnType: { prim: "bool" },
              annotations: [
                { name: "owner", description: "Address of the owner of the token" },
                { name: "operator", description: "Address of the operator" },
                { name: "token_id", description: "Token id" },
              ],
            },
          },
        ],
      },
      {
        name: "token_metadata",
        description: "Token metadata map for a given token id",
        pure: true,
        implementations: [
          {
            michelsonStorageView: {
              code: tokenMetadataCode,
              parameter: { prim: "nat", annots: ["%token_id"] },
              returnType: {
                prim: "pair",
                args: [
                  { prim: "nat", annots: ["%token_id"] },
                  { prim: "map", annots: ["%token_info"], args: [{ prim: "string" }, { prim: "bytes" }] },
                ],
              },
              annotations: [
                { name: "token_id", description: "Token id" },
                { name: "token_info", description: "Token info map with string as keys and bytes as values" },
              ],
            },
          },
        ],
      },
    ],
  };

  /** saving */
  console.log(kleur.yellow(`Saving ${kleur.bold(CONTRACT_METADATA_FILE_NAME)} file.`));
  await fs.promises.writeFile(CONTRACT_METADATA_FILE_PATH, JSON.stringify(contractMetadata, null, 2));
  console.log(kleur.dim(CONTRACT_METADATA_FILE_PATH));
}
