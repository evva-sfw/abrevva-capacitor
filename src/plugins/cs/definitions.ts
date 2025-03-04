export interface CSConnectionOptions {
  url: string;
  clientId: string;
  username: string;
  password: string;
}

export interface CSWriteOptions {
  timeout: number;
}

export interface AbrevvaCodingStationInterface {
  register(options: CSConnectionOptions): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  write(): Promise<void>;
}
