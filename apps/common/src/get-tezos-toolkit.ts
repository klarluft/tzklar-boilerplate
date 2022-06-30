import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { Tzip12Module } from "@taquito/tzip12";
import { Tzip16Module } from "@taquito/tzip16";
import * as kleur from "kleur";

import { RPC_URL, SIGNER_SECRET_KEY } from "./configuration";

export async function getTezosToolkit(): Promise<TezosToolkit> {
  const tezosToolkit = new TezosToolkit(RPC_URL);
  tezosToolkit.addExtension(new Tzip12Module());
  tezosToolkit.addExtension(new Tzip16Module());
  await tezosToolkit.setProvider({ signer: await InMemorySigner.fromSecretKey(SIGNER_SECRET_KEY) });
  return tezosToolkit;
}

export async function checkTezosConfig(): Promise<void> {
  const tezosToolkit = await getTezosToolkit();

  const rpcUrl = tezosToolkit.rpc.getRpcUrl();
  const accountAddress = await tezosToolkit.signer.publicKeyHash();

  console.log(kleur.yellow(`Credentials are valid`));
  console.log(kleur.yellow(`RPC url: ${kleur.bold(rpcUrl)}`));
  console.log(kleur.yellow(`Signer address: ${kleur.bold(accountAddress)}`));
}
