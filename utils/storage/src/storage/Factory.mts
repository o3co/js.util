import path from "node:path";
import type { Storage } from "./Storage.mjs";
import { LocalStorage } from "./LocalStorage.mjs";
import { S3Storage } from "./S3Storage.mjs";
import { HttpStorage } from "./HttpStorage.mjs";
import { Adapter } from "./Adapter.mjs";

export type StorageType = "file" | "s3" | "http";

export interface CreateAdapterRequest {
  protocols: Array<StorageType>
}

export class Factory {
  protected config: Record<string, any>

  constructor(config) {
    this.config = config
  }

  createAdapter({ protocols = ["file", "s3", "http"]}: CreateAdapterRequest): Adapter {
    return new Adapter({ protocols, factory: this })
  }

  createForUri(uri: URL): Storage {
    return this.createForProtocol(uri.protocol.slice(0, -1)) 
  }

  createForProtocol(protocol: string): Storage {
    switch (protocol) {
      case "http":
      case "https":
        return new HttpStorage();
      case "file":
        return new LocalStorage();
      case "s3": {
        return new S3Storage();
      }
      default:
        throw new Error(`Unsupported storage protocol: ${protocol}`);
    }
  }
}
