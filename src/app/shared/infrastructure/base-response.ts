/** Base contract for resources returned by the NodeSecure RESTful API. */
export interface BaseResponse {
  id: number | string;
}

/** Envelope used by collection endpoints. */
export interface BaseCollectionResponse<TResource extends BaseResponse> {
  items: TResource[];
}
