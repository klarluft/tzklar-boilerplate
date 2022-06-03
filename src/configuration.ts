/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from "fs";
import path from "path";

export type Network = "sandbox" | "hangzhounet" | "mainnet";
export const NETWORKS: Network[] = ["sandbox", "hangzhounet", "mainnet"];

export const INFO_DIRECTORY_NAME = "info";
export const CONTRACT_DIRECTORY_NAME = "contract";

/** SECRETS FROM .env FILE */
export const PINATA_API_KEY = process.env.PINATA_API_KEY!;
if (!PINATA_API_KEY) throw new Error("PINATA_API_KEY not specified");

export const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY!;
if (!PINATA_SECRET_API_KEY) throw new Error("PINATA_SECRET_API_KEY not specified");

export const NETWORK = process.env.NETWORK as Network;
if (!NETWORK || !NETWORKS.includes(NETWORK)) throw new Error("NETWORK not specified or invalid");

export const RPC_URL = process.env.RPC_URL!;
if (!RPC_URL) throw new Error("RPC_URL not specified");

export const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS!;
if (!SIGNER_ADDRESS) throw new Error("SIGNER_ADDRESS not specified");

export const SIGNER_SECRET_KEY = process.env.SIGNER_SECRET_KEY!;
if (!SIGNER_SECRET_KEY) throw new Error("SIGNER_SECRET_KEY not specified");

/** SANDBOX (DOCKER) CONFIG */
export const DOCKER_SANDBOX_NAME = "tezos-sandbox";
export const DOCKER_SANDBOX_IMAGE = "oxheadalpha/flextesa:20211221";
export const DOCKER_SANDBOX_SCRIPT: "hangzbox" | "ithacabox" | "alphabox" = "hangzbox";

/** OTHER CONFIGS */
export const PACKAGE_JSON_FILE_PATH = getRelativePath("../package.json");

export const CONTRACT_FILE_NAME = "contract";
export const CONTRACT_RELIGO_SYNTAX = "religo";
export const CONTRACT_JSLIGO_SYNTAX = "jsligo";
export const CONTRACT_RELIGO_FILE_NAME = `${CONTRACT_FILE_NAME}.${CONTRACT_RELIGO_SYNTAX}`;
export const CONTRACT_RELIGO_FILE_PATH = getContractPath(CONTRACT_RELIGO_FILE_NAME);
export const CONTRACT_JSLIGO_FILE_NAME = `${CONTRACT_FILE_NAME}.${CONTRACT_JSLIGO_SYNTAX}`;
export const CONTRACT_JSLIGO_FILE_PATH = getContractPath(CONTRACT_JSLIGO_FILE_NAME);
export const CONTRACT_SYNTAXES = {
  [CONTRACT_RELIGO_SYNTAX]: [CONTRACT_RELIGO_FILE_NAME, CONTRACT_RELIGO_FILE_PATH],
  [CONTRACT_JSLIGO_SYNTAX]: [CONTRACT_JSLIGO_FILE_NAME, CONTRACT_JSLIGO_FILE_PATH],
};

export const CONTRACT_TZ_FILE_NAME = `${CONTRACT_FILE_NAME}.tz`;
export const CONTRACT_TZ_FILE_PATH = getContractPath(CONTRACT_TZ_FILE_NAME);

export const CONTRACT_JSON_FILE_NAME = `${CONTRACT_FILE_NAME}.json`;
export const CONTRACT_JSON_FILE_PATH = getContractPath(CONTRACT_JSON_FILE_NAME);

export const OFF_CHAIN_VIEW_GET_BALANCE_EXPRESSION = "get_balance_off_chain_view";
export const OFF_CHAIN_VIEW_GET_BALANCE_CODE_FILE_NAME = `${CONTRACT_FILE_NAME}-get-balance.json`;
export const OFF_CHAIN_VIEW_GET_BALANCE_CODE_FILE_PATH = getContractPath(OFF_CHAIN_VIEW_GET_BALANCE_CODE_FILE_NAME);

export const OFF_CHAIN_VIEW_TOTAL_SUPPLY_EXPRESSION = "total_supply_off_chain_view";
export const OFF_CHAIN_VIEW_TOTAL_SUPPLY_CODE_FILE_NAME = `${CONTRACT_FILE_NAME}-total-supply.json`;
export const OFF_CHAIN_VIEW_TOTAL_SUPPLY_CODE_FILE_PATH = getContractPath(OFF_CHAIN_VIEW_TOTAL_SUPPLY_CODE_FILE_NAME);

export const OFF_CHAIN_VIEW_ALL_TOKENS_EXPRESSION = "all_tokens_off_chain_view";
export const OFF_CHAIN_VIEW_ALL_TOKENS_CODE_FILE_NAME = `${CONTRACT_FILE_NAME}-all-tokens.json`;
export const OFF_CHAIN_VIEW_ALL_TOKENS_CODE_FILE_PATH = getContractPath(OFF_CHAIN_VIEW_ALL_TOKENS_CODE_FILE_NAME);

export const OFF_CHAIN_VIEW_IS_OPERATOR_EXPRESSION = "is_operator_off_chain_view";
export const OFF_CHAIN_VIEW_IS_OPERATOR_CODE_FILE_NAME = `${CONTRACT_FILE_NAME}-is-operator.json`;
export const OFF_CHAIN_VIEW_IS_OPERATOR_CODE_FILE_PATH = getContractPath(OFF_CHAIN_VIEW_IS_OPERATOR_CODE_FILE_NAME);
export const OFF_CHAIN_VIEW_TOKEN_METADATA_EXPRESSION = "token_metadata_off_chain_view";
export const OFF_CHAIN_VIEW_TOKEN_METADATA_CODE_FILE_NAME = `${CONTRACT_FILE_NAME}-token-metadata.json`;
export const OFF_CHAIN_VIEW_TOKEN_METADATA_CODE_FILE_PATH = getContractPath(
  OFF_CHAIN_VIEW_TOKEN_METADATA_CODE_FILE_NAME
);

export const OFF_CHAIN_VIEWS_TO_COMPILE = [
  {
    expressionName: OFF_CHAIN_VIEW_GET_BALANCE_EXPRESSION,
    fileName: OFF_CHAIN_VIEW_GET_BALANCE_CODE_FILE_NAME,
    filePath: OFF_CHAIN_VIEW_GET_BALANCE_CODE_FILE_PATH,
  },
  {
    expressionName: OFF_CHAIN_VIEW_TOTAL_SUPPLY_EXPRESSION,
    fileName: OFF_CHAIN_VIEW_TOTAL_SUPPLY_CODE_FILE_NAME,
    filePath: OFF_CHAIN_VIEW_TOTAL_SUPPLY_CODE_FILE_PATH,
  },
  {
    expressionName: OFF_CHAIN_VIEW_ALL_TOKENS_EXPRESSION,
    fileName: OFF_CHAIN_VIEW_ALL_TOKENS_CODE_FILE_NAME,
    filePath: OFF_CHAIN_VIEW_ALL_TOKENS_CODE_FILE_PATH,
  },
  {
    expressionName: OFF_CHAIN_VIEW_IS_OPERATOR_EXPRESSION,
    fileName: OFF_CHAIN_VIEW_IS_OPERATOR_CODE_FILE_NAME,
    filePath: OFF_CHAIN_VIEW_IS_OPERATOR_CODE_FILE_PATH,
  },
  {
    expressionName: OFF_CHAIN_VIEW_TOKEN_METADATA_EXPRESSION,
    fileName: OFF_CHAIN_VIEW_TOKEN_METADATA_CODE_FILE_NAME,
    filePath: OFF_CHAIN_VIEW_TOKEN_METADATA_CODE_FILE_PATH,
  },
];

export const CONTRACT_METADATA_FILE_NAME = `${CONTRACT_FILE_NAME}-contract-metadata.json`;
export const CONTRACT_METADATA_FILE_PATH = getInfoPath(CONTRACT_METADATA_FILE_NAME);
export const CONTRACT_METADATA_IPFS_FILE_NAME = `${CONTRACT_FILE_NAME}-contract-metadata-ipfs.json`;
export const CONTRACT_METADATA_IPFS_FILE_PATH = getInfoPath(CONTRACT_METADATA_IPFS_FILE_NAME);

export const TOKEN_0_SYMBOL = "TSTTKN0";
export const TOKEN_0_NAME = "Test Token";
export const TOKEN_0_METADATA_FILE_NAME = `${CONTRACT_FILE_NAME}-0-token-metadata.json`;
export const TOKEN_0_METADATA_FILE_PATH = getInfoPath(TOKEN_0_METADATA_FILE_NAME);
export const TOKEN_0_METADATA_IPFS_FILE_NAME = `${CONTRACT_FILE_NAME}-0-token-metadata-ipfs.json`;
export const TOKEN_0_METADATA_IPFS_FILE_PATH = getInfoPath(TOKEN_0_METADATA_IPFS_FILE_NAME);
export const TOKEN_0_ASSET_FILE_NAME = `${CONTRACT_FILE_NAME}-0-asset.png`;
export const TOKEN_0_ASSET_FILE_PATH = getContractPath(TOKEN_0_ASSET_FILE_NAME);
export const TOKEN_0_ASSET_PX_DIMENSIONS = "300x300";
export const TOKEN_0_ASSET_IPFS_FILE_NAME = `${CONTRACT_FILE_NAME}-0-asset-ipfs.json`;
export const TOKEN_0_ASSET_IPFS_FILE_PATH = getInfoPath(TOKEN_0_ASSET_IPFS_FILE_NAME);

export const CONTRACT_TEZOS_FILE_NAME = `${CONTRACT_FILE_NAME}-tezos.json`;
export const CONTRACT_TEZOS_FILE_PATH = getInfoPath(CONTRACT_TEZOS_FILE_NAME);

function getRelativePath(relativeFilePath: string): string {
  return path.resolve(path.join(__dirname, relativeFilePath));
}

/**
 * Files specific to the contract that should not change when using different network will be kept
 * in "src/contract" directory
 */
function getContractPath(fileName: string): string {
  return path.resolve(path.join(__dirname, CONTRACT_DIRECTORY_NAME, fileName));
}

/**
 * Files that are related to certain network will be kept in separate directories.
 * This let's you for example to keep track of the contract address on mainnet and some other network.
 */
function getInfoPath(fileName: string): string {
  return path.resolve(path.join(__dirname, INFO_DIRECTORY_NAME, NETWORK, fileName));
}

/**
 * Make all necessary directories are there
 */
(function createInfoDirectoriesIfNecessary() {
  fs.mkdirSync(path.resolve(path.join(__dirname, INFO_DIRECTORY_NAME, NETWORK)), { recursive: true });
})();
