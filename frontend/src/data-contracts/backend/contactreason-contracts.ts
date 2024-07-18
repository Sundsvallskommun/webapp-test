export interface Contactreason {
  reason: string;
  created: string;
  modified?: string;
}

export interface ContactreasonsApiResponse {
  data: Contactreason[];
  message: string;
}

export interface ContactreasonApiResponse {
  data: Contactreason;
  message: string;
}

export interface ContactreasonCreateRequest {
  reason: string;
}
