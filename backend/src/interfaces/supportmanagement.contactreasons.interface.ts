export interface ContactreasonInterface {
  id: number;
  reason: string;
  created: string;
  modified?: string;
}

export interface ContactreasonCreateRequestInterface {
  reason: string;
}

export interface ContactreasonUpdateRequestInterface {
  reason: string;
}
