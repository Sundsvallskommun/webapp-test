export interface StatusInterface {
  name: string;
  created: string;
  modified?: string;
  index: number;
}

export interface StatusCreateRequestInterface {
  name: string;
}

export interface StatusUpdateRequestInterface {
  name?: string;
  displayName?: string; // This is not yet available from backend service
}
