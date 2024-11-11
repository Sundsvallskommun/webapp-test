export interface RoleInterface {
  name: string;
  created: string;
  modified?: string;
  index: number;
}

export interface RoleCreateRequestInterface {
  name: string;
}
