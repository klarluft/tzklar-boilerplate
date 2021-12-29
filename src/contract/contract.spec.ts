/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/order */
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

import { compose } from "@taquito/taquito";
import { tzip12 } from "@taquito/tzip12";
import { bytes2Char, tzip16 } from "@taquito/tzip16";
import test from "ava";
import { BigNumber } from "bignumber.js";

import { CONTRACT_TEZOS_FILE_PATH, SIGNER_ADDRESS } from "../configuration";
import { getTezosToolkit } from "../get-tezos-toolkit";
import { ContractTezosInfoType } from "../originate-contract";
import { ContractStorageTokenMetadataValueType } from "../storage";

const setup = async () => {
  const tezosToolkit = await getTezosToolkit();

  const contractTezosInfo = JSON.parse(
    (await fs.promises.readFile(CONTRACT_TEZOS_FILE_PATH)).toString()
  ) as ContractTezosInfoType;

  const contract = await tezosToolkit.contract.at(contractTezosInfo.contractAddress, compose(tzip12, tzip16));

  return { tezosToolkit, contract };
};

test("check if it's TZIP12 compliant", async (t) => {
  const { contract } = await setup();

  const isTzip12Compliant = await contract.tzip12().isTzip12Compliant();

  t.is(isTzip12Compliant, true);
});

test("check if get_balance off-chain view works", async (t) => {
  const { contract } = await setup();

  const contractMetadataViews = await contract.tzip16().metadataViews();

  const balance = (await contractMetadataViews["get_balance"]().executeView(SIGNER_ADDRESS, 0)) as BigNumber;

  t.is(typeof balance.toNumber(), "number");
});

test("check if total_supply off-chain view works", async (t) => {
  const { contract } = await setup();

  const contractMetadataViews = await contract.tzip16().metadataViews();

  const totalSupply = (await contractMetadataViews["total_supply"]().executeView(0)) as BigNumber;

  t.is(typeof totalSupply.toNumber(), "number");
});

test("check if all_tokens off-chain view works", async (t) => {
  const { contract } = await setup();

  const contractMetadataViews = await contract.tzip16().metadataViews();

  const allTokens = (await contractMetadataViews["all_tokens"]().executeView()) as BigNumber[];

  t.is(Array.isArray(allTokens), true);
  t.is(allTokens[0].toNumber(), 0);
});

test("check if is_operator off-chain view works", async (t) => {
  const { contract } = await setup();

  const contractMetadataViews = await contract.tzip16().metadataViews();

  // TODO: introduce some other account to check - now it doesn't make much sense
  const isOperator = (await contractMetadataViews["is_operator"]().executeView(
    SIGNER_ADDRESS,
    SIGNER_ADDRESS,
    0
  )) as boolean;

  t.is(typeof isOperator, "boolean");
});

test("check if token_metadata off-chain view works", async (t) => {
  const { contract } = await setup();

  const contractMetadataViews = await contract.tzip16().metadataViews();

  const tokenMetadata = (await contractMetadataViews["token_metadata"]().executeView(
    0
  )) as ContractStorageTokenMetadataValueType;

  t.is(Number(tokenMetadata.token_id), 0);

  const ipfsUriInBytes = tokenMetadata.token_info.get("")!;
  const ipfsUri = bytes2Char(ipfsUriInBytes);

  t.regex(ipfsUri, /^sha256:\/\/.*\/ipfs:\/\/.*\/contract-0-token-metadata\.json$/);
});
