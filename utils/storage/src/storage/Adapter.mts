import type {
  LoadAsBufferResponse,
  LoadAsByteArrayResponse,
  LoadAsStringResponse,
  SaveResponse,
  SaveOptions,
  Storage,
} from './Storage.mts'
import type { Factory } from './Factory.mts'

export interface AdapterParams {
  protocols: Array<string>
  factory: Factory
}

export class Adapter implements Storage {
  protected protocols: Array<string> = []

  protected factory: Factory

  constructor({ protocols, factory }: AdapterParams) {
    this.protocols = protocols
    this.factory = factory
  }

  async save(
    uri: URL,
    data: string | Buffer | Uint8Array,
    options: SaveOptions,
  ): Promise<SaveResponse> {
    return await (await this.factory.createForUri(uri)).save(uri, data, options)
  }

  /**
   * Load File as String
   */
  async loadAsString(uri: URL): Promise<LoadAsStringResponse> {
    return await (await this.factory.createForUri(uri)).loadAsString(uri)
  }

  /**
   * Load File as String
   */
  async loadAsBuffer(uri: URL): Promise<LoadAsBufferResponse> {
    return await (await this.factory.createForUri(uri)).loadAsBuffer(uri)
  }

  /**
   * Load File as String
   */
  async loadAsByteArray(uri: URL): Promise<LoadAsByteArrayResponse> {
    return await (await this.factory.createForUri(uri)).loadAsByteArray(uri)
  }
}
