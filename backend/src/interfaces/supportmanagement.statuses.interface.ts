export interface StatusInterface {
  name: string;
  created: string;
  modified?: string;
}

export interface StatusCreateRequestInterface {
  name: string;
}

export interface StatusUpdateRequestInterface {
  name?: string;
}
