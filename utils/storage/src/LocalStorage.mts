import { Buffer } from "node:buffer";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import type {
  LoadAsBufferResponse,
  LoadAsByteArrayResponse,
  LoadAsStringResponse,
  SaveOptions,
  SaveResponse,
  Storage,
} from "./Storage.mjs";

export class LocalStorage implements Storage {
  async save(
    uri: URL,
    data: string | Buffer | Uint8Array,
    { contentType }: SaveOptions,
  ): Promise<SaveResponse> {
    // create directory for base path
    await fs.mkdir(path.dirname(uri.pathname), { recursive: true });

    // write file
    await fs.writeFile(uri.pathname, data);

    return {
      uri,
    };
  }

  async loadAsString(uri: URL): Promise<LoadAsStringResponse> {
    try {
      const data = await fs.readFile(uri.pathname, "utf-8");

      return {
        uri,
        data,
        contentType: (await fileTypeFromBuffer(Buffer.from(data)))?.mime,
      };
    } catch (cause) {
      throw new Error(`Failed to load file: ${cause}`, { cause });
    }
  }

  async loadAsBuffer(uri: URL): Promise<LoadAsBufferResponse> {
    try {
      const data = await fs.readFile(uri.pathname);

      return {
        uri,
        data,
        contentType: (await fileTypeFromBuffer(data))?.mime,
      };
    } catch (cause) {
      throw new Error(`Failed to load file: ${cause}`, { cause });
    }
  }

  async loadAsByteArray(uri: URL): Promise<LoadAsByteArrayResponse> {
    const res = await this.loadAsBuffer(uri);

    return {
      ...res,
      data: new Uint8Array(res.data),
    };
  }
}
