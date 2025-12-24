export interface SaveResponse {
  uri: URL
}

export interface LoadResponse {
  data: string | Buffer | Uint8Array
  uri: URL
  contentType: string | undefined
}

export interface LoadAsStringResponse extends LoadResponse {
  data: string
  uri: URL
  contentType: string | undefined
}

export interface LoadAsBufferResponse extends LoadResponse {
  data: Buffer
  uri: URL
  contentType: string | undefined
}

export interface LoadAsByteArrayResponse extends LoadResponse {
  data: Uint8Array
  uri: URL
  contentType: string | undefined
}

export interface SaveOptions {
  contentType?: string | null
}

export interface Storage {
  save(
    uri: URL,
    data: string | Buffer | Uint8Array,
    options?: SaveOptions,
  ): Promise<SaveResponse>

  /**
   * Load File as String
   */
  loadAsString(uri: URL): Promise<LoadAsStringResponse>

  loadAsBuffer(uri: URL): Promise<LoadAsBufferResponse>

  loadAsByteArray(uri: URL): Promise<LoadAsByteArrayResponse>
}
