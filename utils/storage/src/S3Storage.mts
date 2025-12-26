import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import type { StreamingBlobPayloadOutputTypes } from "@smithy/types";
import type {
  LoadAsBufferResponse,
  LoadAsByteArrayResponse,
  LoadAsStringResponse,
  LoadResponse,
  SaveOptions,
  SaveResponse,
  Storage,
} from "./Storage.mjs";

interface LoadAsRawResponse {
  data: StreamingBlobPayloadOutputTypes;
  uri: URL;
  contentType: string | undefined;
}

export class S3Storage implements Storage {
  private client: S3Client;

  constructor() {
    this.client = new S3Client();
  }

  async save(
    uri: URL,
    data: string | Buffer | Uint8Array,
    { contentType }: SaveOptions,
  ): Promise<SaveResponse> {
    const command = new PutObjectCommand({
      Bucket: uri.hostname,
      Key: uri.pathname.substring(1),
      Body: data,
      ContentType: contentType ?? undefined,
    });

    const response = await this.client.send(command);

    return {
      uri,
    };
  }

  async loadAsRaw(uri: URL): Promise<LoadAsRawResponse> {
    try {
      if (uri.protocol !== "s3:") {
        throw new Error("Invalid URI");
      }

      const command = new GetObjectCommand({
        Bucket: uri.hostname,
        Key: uri.pathname.substring(1),
      });

      const response = await this.client.send(command);
      if (!response.Body) {
        throw new Error("Failed to response body undefined");
      }

      const data = await response.Body;

      return {
        data: response.Body,
        uri,
        contentType: response?.ContentType,
      };
    } catch (cause) {
      throw new Error(`Failed to load file from : ${uri}`, { cause });
    }
  }

  async loadAsString(uri: URL): Promise<LoadAsStringResponse> {
    const res = await this.loadAsRaw(uri);

    return {
      ...res,
      data: await res.data.transformToString("utf-8"),
    };
  }

  async loadAsByteArray(uri: URL): Promise<LoadAsByteArrayResponse> {
    const res = await this.loadAsRaw(uri);

    return {
      ...res,
      data: await res.data.transformToByteArray(),
    };
  }

  async loadAsBuffer(uri: URL): Promise<LoadAsBufferResponse> {
    const res = await this.loadAsByteArray(uri);

    return {
      ...res,
      data: Buffer.from(res.data),
    };
  }
}
