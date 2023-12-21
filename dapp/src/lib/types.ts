export interface DeployedContract {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export type OperationMode = "wrap" | "unwrap";
