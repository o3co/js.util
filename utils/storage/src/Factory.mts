import path from "node:path";
import { Adapter } from "./Adapter.mjs";
import type { Storage } from "./Storage.mjs";

export type StorageType = "file" | "s3" | "http";

export interface CreateAdapterRequest {
  protocols: Array<StorageType>;
}

export class Factory {
  protected config: Record<string, any>;

  constructor(config) {
    this.config = config;
  }

  createAdapter({
    protocols = ["file", "s3", "http"],
  }: CreateAdapterRequest): Adapter {
    return new Adapter({ protocols, factory: this });
  }

  async createForUri(uri: URL): Promise<Storage> {
    return await this.createForProtocol(uri.protocol.slice(0, -1));
  }

  async createForProtocol(protocol: string): Promise<Storage> {
    switch (protocol) {
      case "http":
      case "https": {
        const { Storage } = await import("./HttpStorage.mjs");
        return new Storage();
      }
      case "file": {
        const { Storage } = await import("./LocalStorage.mjs");
        return new Storage();
      }
      case "s3": {
        const { Storage } = await import("./S3Storage.mjs");
        return new Storage();
      }
      default:
        throw new Error(`Unsupported storage protocol: ${protocol}`);
    }
  }
}
