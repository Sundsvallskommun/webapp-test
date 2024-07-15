export interface Role {
  name: string;
  created: string;
  modified?: string;
}

export interface RolesApiResponse {
  data: Role[];
  message: string;
}

export interface RoleApiResponse {
  data: Role;
  message: string;
}

export interface RoleCreateRequest {
  name: string;
}
