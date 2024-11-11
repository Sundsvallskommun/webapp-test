export interface StatusInterface {
  name: string;
  created: string;
  modified?: string;
  index: number;
}

export interface StatusCreateRequestInterface {
  name: string;
}
