export interface RoleInterface {
  name: string;
  displayName?: string;
  created: string;
  modified?: string;
  index: number;
}

export interface RoleCreateRequestInterface {
  name: string;
  displayName?: string;
}

export interface RoleUpdateRequestInterface {
  name?: string;
  displayName?: string;
}
