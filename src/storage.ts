import { MichelsonMap } from "@taquito/taquito";

export type ContractStorageLedgerType = MichelsonMap<[string, number], number>;
export type ContractStorageOperatorsType = MichelsonMap<[string, [string, number]], null>;
export type ContractStorageMetadataType = MichelsonMap<string, string>;
export type ContractStorageTokenMetadataTokenInfo = MichelsonMap<string, string>;
export type ContractStorageTokenMetadataValueType = {
  token_id: number;
  token_info: ContractStorageTokenMetadataTokenInfo;
};
export type ContractStorageTokenMetadataType = MichelsonMap<number, ContractStorageTokenMetadataValueType>;
export type ContractStorageTotalSupplyType = MichelsonMap<number, number>;
export type ContractStorageAllTokensType = number[];
export type ContractStorageAdminType = string;

export interface ContractStorage {
  ledger: ContractStorageLedgerType;
  operators: ContractStorageOperatorsType;
  metadata: ContractStorageMetadataType;
  token_metadata: ContractStorageTokenMetadataType;
  total_supply: ContractStorageTotalSupplyType;
  all_tokens: ContractStorageAllTokensType;
  admin: ContractStorageAdminType;
}
