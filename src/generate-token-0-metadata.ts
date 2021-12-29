import fs from "fs";

import * as kleur from "kleur";
import { IPFSFileInfo, TokenMetadata } from "tzklar";

import {
  TOKEN_0_ASSET_FILE_NAME,
  TOKEN_0_ASSET_IPFS_FILE_NAME,
  TOKEN_0_ASSET_IPFS_FILE_PATH,
  TOKEN_0_ASSET_PX_DIMENSIONS,
  TOKEN_0_METADATA_FILE_NAME,
  TOKEN_0_METADATA_FILE_PATH,
  TOKEN_0_NAME,
  TOKEN_0_SYMBOL,
} from "./configuration";

/**
 * This function generates token `0` metadata json file and saves it.
 *
 * It relies on token `0` asset IPFS info json file that was previously generated.
 */
export async function generateToken0Metadata() {
  /** read asset IPFS info file */
  console.log(kleur.yellow(`reads ${kleur.bold(TOKEN_0_ASSET_IPFS_FILE_NAME)} file`));
  console.log(kleur.dim(TOKEN_0_ASSET_IPFS_FILE_PATH));
  console.log("");
  const assetIPFSInfo = JSON.parse(
    (await fs.promises.readFile(TOKEN_0_ASSET_IPFS_FILE_PATH)).toString()
  ) as IPFSFileInfo;

  const tokenMetadata: TokenMetadata = {
    name: TOKEN_0_NAME,
    decimals: 0,
    symbol: TOKEN_0_SYMBOL,
    formats: [
      {
        fileName: TOKEN_0_ASSET_FILE_NAME,
        dimensions: {
          unit: "px",
          value: TOKEN_0_ASSET_PX_DIMENSIONS,
        },
        fileSize: assetIPFSInfo.sizeInBytes,
        mimeType: "image/png",
        hash: assetIPFSInfo.fileSHA256Checksum,
        uri: assetIPFSInfo.ipfsUri,
      },
    ],
    artifactUri: assetIPFSInfo.ipfsUri,
    shouldPreferSymbol: false,
    isBooleanAmount: true,
    isTransferable: true,
    type: "image",
  };

  /** saving */
  await fs.promises.writeFile(TOKEN_0_METADATA_FILE_PATH, JSON.stringify(tokenMetadata, null, 2));
  console.log(kleur.yellow(`saving ${kleur.bold(TOKEN_0_METADATA_FILE_NAME)} file`));
  console.log(kleur.dim(TOKEN_0_METADATA_FILE_PATH));
}
