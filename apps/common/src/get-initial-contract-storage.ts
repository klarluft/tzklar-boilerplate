import fs from "fs";

import { MichelsonMap } from "@taquito/taquito";
import { char2Bytes } from "@taquito/tzip16";
import * as kleur from "kleur";
import { IPFSFileInfo } from "tzklar";

import {
  CONTRACT_METADATA_IPFS_FILE_NAME,
  CONTRACT_METADATA_IPFS_FILE_PATH,
  SIGNER_ADDRESS,
  TOKEN_0_METADATA_IPFS_FILE_NAME,
  TOKEN_0_METADATA_IPFS_FILE_PATH,
} from "./configuration";
import {
  ContractStorage,
  ContractStorageAdminType,
  ContractStorageAllTokensType,
  ContractStorageLedgerType,
  ContractStorageMetadataType,
  ContractStorageOperatorsType,
  ContractStorageTokenMetadataTokenInfo,
  ContractStorageTokenMetadataType,
  ContractStorageTotalSupplyType,
} from "./storage";

/**
 * Constructs initial contract storage and returns it.
 *
 * It relies on IPFS info JSON files generated previously (contract metadata and token `0` metadata).
 */
export async function getInitialContractStorage(): Promise<ContractStorage> {
  /** read contract metadata json file */
  console.log(kleur.yellow(`reads ${kleur.bold(CONTRACT_METADATA_IPFS_FILE_NAME)} file`));
  console.log(kleur.dim(CONTRACT_METADATA_IPFS_FILE_PATH));
  console.log("");
  const contractMetadataIPFSInfo = JSON.parse(
    (await fs.promises.readFile(CONTRACT_METADATA_IPFS_FILE_PATH)).toString()
  ) as IPFSFileInfo;

  /** read token 0 metadata json file */
  console.log(kleur.yellow(`reads ${kleur.bold(TOKEN_0_METADATA_IPFS_FILE_NAME)} file`));
  console.log(kleur.dim(TOKEN_0_METADATA_IPFS_FILE_PATH));
  console.log("");
  const token0MetadataIPFSInfo = JSON.parse(
    (await fs.promises.readFile(TOKEN_0_METADATA_IPFS_FILE_PATH)).toString()
  ) as IPFSFileInfo;

  /**
   * big_map %ledger (pair address nat) nat
   */
  console.log(kleur.yellow(`constructing ${kleur.bold(`ledger`)} storage property`));
  const ledger: ContractStorageLedgerType = new MichelsonMap<[string, number], number>({
    prim: "big_map",
    annots: ["%ledger"],
    args: [
      { prim: "pair", args: [{ prim: "address" }, { prim: "nat" }] },
      {
        prim: "nat",
      },
    ],
  });

  /**
   * big_map %operators (pair address (pair address nat)) unit
   */
  console.log(kleur.yellow(`constructing ${kleur.bold(`operators`)} storage property`));
  const operators: ContractStorageOperatorsType = new MichelsonMap<[string, [string, number]], null>({
    prim: "big_map",
    annots: ["%operators"],
    args: [
      { prim: "pair", args: [{ prim: "address" }, { prim: "pair", args: [{ prim: "address" }, { prim: "nat" }] }] },
      { prim: "unit" },
    ],
  });

  /**
   * big_map %metadata string bytes
   */
  console.log(kleur.yellow(`constructing ${kleur.bold(`metadata`)} storage property`));
  const metadata: ContractStorageMetadataType = new MichelsonMap<string, string>({
    prim: "big_map",
    annots: ["%metadata"],
    args: [{ prim: "string" }, { prim: "bytes" }],
  });

  /** setting contract metadata ipfs uri */
  console.log(kleur.yellow(`setting contract ${kleur.bold(`metadata`)} ipfs uri`));
  metadata.set("", char2Bytes(contractMetadataIPFSInfo.ipfsUriWithChecksum));

  /**
   * map %token_info string bytes
   */
  console.log(kleur.yellow(`constructing token_metadata's ${kleur.bold(`token_info`)} storage property`));
  const token_metadata_0_token_info: ContractStorageTokenMetadataTokenInfo = new MichelsonMap<string, string>({
    prim: "map",
    annots: ["%token_info"],
    args: [{ prim: "string" }, { prim: "bytes" }],
  });

  /** setting token 0 contract metadata ipfs uri */
  console.log(kleur.yellow(`setting ${kleur.bold(`token_metadata`)} ipfs uri for token 0`));
  token_metadata_0_token_info.set("", char2Bytes(token0MetadataIPFSInfo.ipfsUriWithChecksum));

  /**
   * big_map %token_metadata nat (pair (nat %token_id) (map %token_info string bytes))
   */
  console.log(kleur.yellow(`constructing ${kleur.bold(`token_metadata`)} storage property`));
  const token_metadata: ContractStorageTokenMetadataType = new MichelsonMap<
    number,
    { token_id: number; token_info: ContractStorageTokenMetadataTokenInfo }
  >({
    prim: "big_map",
    annots: ["%token_metadata"],
    args: [
      { prim: "nat" },
      {
        prim: "pair",
        args: [
          { prim: "nat", annots: ["%token_id"] },
          { prim: "map", annots: ["%token_info"], args: [{ prim: "string" }, { prim: "bytes" }] },
        ],
      },
    ],
  });

  /** connecting token 0 info to token metadata */
  console.log(kleur.yellow(`connecting token 0 info to token metadata`));
  token_metadata.set(0, {
    token_id: 0,
    token_info: token_metadata_0_token_info,
  });

  /**
   * big_map %total_supply nat nat
   */
  console.log(kleur.yellow(`constructing ${kleur.bold(`total_supply`)} storage property`));
  const total_supply: ContractStorageTotalSupplyType = new MichelsonMap<number, number>({
    prim: "big_map",
    args: [{ prim: "nat" }, { prim: "nat" }],
  });

  /** setting supply for token 0 to 0 */
  console.log(kleur.yellow(`setting total supply for token 0 to 0`));
  total_supply.set(0, 0);

  /**
   * all_tokens - specifying all supported tokens
   * list(nat)
   */
  console.log(kleur.yellow(`constructing ${kleur.bold(`all_tokens`)} storage property with [0]`));
  const all_tokens: ContractStorageAllTokensType = [0];

  console.log(kleur.yellow(`constructing ${kleur.bold(`admin`)} storage property with signer ${SIGNER_ADDRESS}`));
  const admin: ContractStorageAdminType = SIGNER_ADDRESS;

  console.log(kleur.yellow(`putting storage together`));
  console.log("");
  const storage: ContractStorage = {
    ledger,
    operators,
    metadata,
    token_metadata,
    total_supply,
    all_tokens,
    admin,
  };

  return storage;
}
