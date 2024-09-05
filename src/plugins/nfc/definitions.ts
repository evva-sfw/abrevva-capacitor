export interface AbrevvaPluginNFCInterface {
  read(): Promise<{ value: string }>;
  connect(): Promise<{ value: string }>;
  disconnect(): Promise<{ value: string }>;
}
