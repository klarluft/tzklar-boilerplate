import fs from "fs";

import pinataSDK from "@pinata/sdk";
import * as kleur from "kleur";
import { pinFileToIPFS } from "tzklar";

import {
  CONTRACT_METADATA_FILE_NAME,
  CONTRACT_METADATA_FILE_PATH,
  CONTRACT_METADATA_IPFS_FILE_NAME,
  CONTRACT_METADATA_IPFS_FILE_PATH,
  PINATA_API_KEY,
  PINATA_SECRET_API_KEY,
} from "./configuration";

const pinataClient = pinataSDK(PINATA_API_KEY, PINATA_SECRET_API_KEY);

/**
 * This function takes contract metadata json, pins it using Pinata and saves IPFS info into a json file
 */
export async function pinContractMetadata() {
  /** pinning contract metadata */
  console.log(kleur.yellow(`pinning ${kleur.bold(CONTRACT_METADATA_FILE_NAME)} asset file using Pinata`));
  console.log(kleur.dim(CONTRACT_METADATA_FILE_PATH));
  console.log("");
  const contractMetadataIPFSFileInfo = await pinFileToIPFS({
    pinataClient,
    filePath: CONTRACT_METADATA_FILE_PATH,
  });

  /** saving */
  await fs.promises.writeFile(CONTRACT_METADATA_IPFS_FILE_PATH, JSON.stringify(contractMetadataIPFSFileInfo));
  console.log(kleur.yellow(`saved ${kleur.bold(CONTRACT_METADATA_IPFS_FILE_NAME)} IPFS info file`));
  console.log(kleur.dim(CONTRACT_METADATA_IPFS_FILE_PATH));
}
