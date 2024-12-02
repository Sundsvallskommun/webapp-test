export interface Status {
  name: string;
  created: string;
  modified?: string;
}

export interface StatusesApiResponse {
  data: Status[];
  message: string;
}

export interface StatusApiResponse {
  data: Status;
  message: string;
}

export interface StatusCreateRequest {
  name: string;
}

export interface StatusUpdateRequest {
  name?: string;
}
