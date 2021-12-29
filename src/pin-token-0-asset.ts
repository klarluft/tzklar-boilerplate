import fs from "fs";

import pinataSDK from "@pinata/sdk";
import * as kleur from "kleur";
import { pinFileToIPFS } from "tzklar";

import {
  PINATA_API_KEY,
  PINATA_SECRET_API_KEY,
  TOKEN_0_ASSET_FILE_PATH,
  TOKEN_0_ASSET_IPFS_FILE_NAME,
  TOKEN_0_ASSET_IPFS_FILE_PATH,
} from "./configuration";

const pinataClient = pinataSDK(PINATA_API_KEY, PINATA_SECRET_API_KEY);

/**
 * This function takes token `0` asset file, pins it using Pinata and saves IPFS info into a json file
 */
export async function pinToken0Asset() {
  /** pinning */
  console.log(kleur.yellow(`pinning ${kleur.bold(TOKEN_0_ASSET_IPFS_FILE_NAME)} asset file using Pinata`));
  console.log(kleur.dim(TOKEN_0_ASSET_FILE_PATH));
  console.log("");
  const assetIPFSFileInfo = await pinFileToIPFS({
    pinataClient,
    filePath: TOKEN_0_ASSET_FILE_PATH,
  });

  /** saving */
  await fs.promises.writeFile(TOKEN_0_ASSET_IPFS_FILE_PATH, JSON.stringify(assetIPFSFileInfo));
  console.log(kleur.yellow(`saved ${kleur.bold(TOKEN_0_ASSET_IPFS_FILE_NAME)} IPFS info file`));
  console.log(kleur.dim(TOKEN_0_ASSET_IPFS_FILE_PATH));
}
