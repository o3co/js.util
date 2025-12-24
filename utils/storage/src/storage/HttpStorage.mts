import type {
  LoadAsBufferResponse,
  LoadAsByteArrayResponse,
  LoadAsStringResponse,
  SaveOptions,
  SaveResponse,
  Storage,
} from './Storage.mjs'

import { fetch } from "undici"
import type { Response as FetchResponse } from 'undici-types'

interface LoadAsRawResponse {
  data: FetchResponse 
  uri: URL
  contentType: string | undefined,
}

export class HttpStorage implements Storage {
  save(
    uri: URL,
    data: string | Buffer | Uint8Array,
    options?: SaveOptions,
  ): Promise<SaveResponse> {
    throw new Error(`HttpStorage is not supported save`)
  }

  async loadAsRaw(uri: URL): Promise<LoadAsRawResponse> {
    const res = await fetch(uri)

    return {
      uri,
      data: res,
      contentType: res.headers.get('content-type') ?? undefined,
    }
  }

  async loadAsString(uri: URL): Promise<LoadAsStringResponse> {
    try {
      const res = await this.loadAsRaw(uri)

      return {
        ...res,
        data: await res.data.text(),
      }
    } catch (cause) {
      throw new Error(`Failed to load file: ${cause}`, { cause })
    }
  }

  async loadAsBuffer(uri: URL): Promise<LoadAsBufferResponse> {
    try {
      const res = await this.loadAsRaw(uri)

      return {
        ...res,
        data: Buffer.from(await res.data.arrayBuffer()),
      }
    } catch (cause) {
      throw new Error(`Failed to load file: ${cause}`, { cause })
    }
  }

  async loadAsByteArray(uri: URL): Promise<LoadAsByteArrayResponse> {
    try {
      const res = await this.loadAsRaw(uri)

      return {
        ...res,
        data: await res.data.bytes(),
      }
    } catch (cause) {
      throw new Error(`Failed to load file: ${cause}`, { cause })
    }
  }
}
