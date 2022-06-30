import fs from "fs";

import pinataSDK from "@pinata/sdk";
import * as kleur from "kleur";
import { pinFileToIPFS } from "tzklar";

import {
  PINATA_API_KEY,
  PINATA_SECRET_API_KEY,
  TOKEN_0_METADATA_FILE_NAME,
  TOKEN_0_METADATA_FILE_PATH,
  TOKEN_0_METADATA_IPFS_FILE_NAME,
  TOKEN_0_METADATA_IPFS_FILE_PATH,
} from "./configuration";

const pinataClient = pinataSDK(PINATA_API_KEY, PINATA_SECRET_API_KEY);

/**
 * This function takes token `0` metadata json, pins it using Pinata and saves IPFS info into a json file
 */
export async function pinToken0Metadata() {
  /** reads json file */
  console.log(kleur.yellow(`pinning ${kleur.bold(TOKEN_0_METADATA_FILE_NAME)} file using Pinata`));
  console.log(kleur.dim(TOKEN_0_METADATA_FILE_PATH));
  console.log("");
  const token0MetadataIPFSFileInfo = await pinFileToIPFS({
    pinataClient,
    filePath: TOKEN_0_METADATA_FILE_PATH,
  });

  /** saving */
  await fs.promises.writeFile(TOKEN_0_METADATA_IPFS_FILE_PATH, JSON.stringify(token0MetadataIPFSFileInfo));
  console.log(kleur.yellow(`saved ${kleur.bold(TOKEN_0_METADATA_IPFS_FILE_NAME)} file`));
  console.log(kleur.dim(TOKEN_0_METADATA_IPFS_FILE_PATH));
}
