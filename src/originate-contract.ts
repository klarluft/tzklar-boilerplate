import fs from "fs";

import * as kleur from "kleur";

import {
  CONTRACT_TEZOS_FILE_NAME,
  CONTRACT_TEZOS_FILE_PATH,
  CONTRACT_TZ_FILE_NAME,
  CONTRACT_TZ_FILE_PATH,
  SIGNER_ADDRESS,
} from "./configuration";
import { getInitialContractStorage } from "./get-initial-contract-storage";
import { getTezosToolkit } from "./get-tezos-toolkit";

export interface ContractTezosInfoType {
  contractAddress: string;
}

/**
 * It originates the contract and saves info about the address in a JSON file
 */
export async function originateContract() {
  const initialContractStorage = await getInitialContractStorage();

  /** reads contract code (tz) */
  console.log(kleur.yellow(`reads contract code from ${kleur.bold(CONTRACT_TZ_FILE_NAME)} file`));
  console.log(kleur.dim(CONTRACT_TZ_FILE_PATH));
  console.log("");
  const contractCode = (await fs.promises.readFile(CONTRACT_TZ_FILE_PATH)).toString();

  /** get tezos toolkit */
  console.log(kleur.yellow(`gets tezos toolkit for ${kleur.bold(SIGNER_ADDRESS)}`));
  console.log("");
  const tezosToolkit = await getTezosToolkit();

  /** originating contract */
  console.log(kleur.yellow(`originating contract`));
  console.log("");
  const originationOp = await tezosToolkit.contract.originate({
    code: contractCode,
    storage: initialContractStorage,
  });

  /** waiting for confirmation */
  console.log(kleur.yellow(`waiting for confirmation`));
  console.log("");
  const { address: contractAddress } = await originationOp.contract();
  console.log(kleur.yellow(`contract originated with ${kleur.green(contractAddress)} address`));
  console.log("");

  const contractTezosInfo: ContractTezosInfoType = { contractAddress };

  /** saving */
  await fs.promises.writeFile(CONTRACT_TEZOS_FILE_PATH, JSON.stringify(contractTezosInfo));
  console.log(kleur.yellow(`saved ${kleur.yellow(CONTRACT_TEZOS_FILE_NAME)} file`));
  console.log(kleur.dim(CONTRACT_TEZOS_FILE_PATH));
}
