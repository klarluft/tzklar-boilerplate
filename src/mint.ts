import fs from "fs";

import { compose } from "@taquito/taquito";
import { tzip12 } from "@taquito/tzip12";
import { tzip16 } from "@taquito/tzip16";
import * as kleur from "kleur";

import { CONTRACT_TEZOS_FILE_NAME, CONTRACT_TEZOS_FILE_PATH, SIGNER_ADDRESS } from "./configuration";
import { getTezosToolkit } from "./get-tezos-toolkit";
import { ContractTezosInfoType } from "./originate-contract";

interface MintProps {
  tokenId: number;
  toAccount: string;
}

/**
 * Mints a token to some account
 */
export async function mint({ tokenId, toAccount }: MintProps) {
  /** reads info about originated contract */
  console.log(kleur.yellow(`reads ${kleur.bold(CONTRACT_TEZOS_FILE_NAME)} file`));
  console.log(kleur.dim(CONTRACT_TEZOS_FILE_PATH));
  console.log("");
  const contractTezosInfo = JSON.parse(
    (await fs.promises.readFile(CONTRACT_TEZOS_FILE_PATH)).toString()
  ) as ContractTezosInfoType;

  /** get tezos toolkit */
  console.log(kleur.yellow(`gets tezos toolkit for ${kleur.bold(SIGNER_ADDRESS)}`));
  const tezosToolkit = await getTezosToolkit();

  const contract = await tezosToolkit.contract.at(contractTezosInfo.contractAddress, compose(tzip12, tzip16));

  /** minting */
  console.log(kleur.yellow(`minting 1 token ${kleur.bold(tokenId)} to ${kleur.bold(toAccount)} account`));
  const mintOperation = await contract.methodsObject.mint([{ to_: toAccount, token_id: tokenId, amount: 1 }]).send();

  console.log(kleur.yellow(`waiting for confirmation`));
  await mintOperation.confirmation(1);
  console.log(kleur.yellow(`minting confirmed`));
}
