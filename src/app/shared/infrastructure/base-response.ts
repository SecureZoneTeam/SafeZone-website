/** Base contract for resources returned by the NodeSecure RESTful API. */
export interface BaseResponse {
  id: number | string;
}

export interface BaseCollectionResponse<TResource extends BaseResponse> {
  items: TResource[];
}
