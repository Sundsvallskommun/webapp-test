export interface Contactreason {
  id: number;
  reason: string;
  created: string;
  modified?: string;
}

export interface ContactreasonsApiResponse {
  data: Contactreason[];
  message: string;
}

export interface ContactreasonCreateRequest {
  reason: string;
}

export interface ContactreasonUpdateRequest {
  reason: string;
}