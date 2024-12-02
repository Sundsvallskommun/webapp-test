export interface Role {
  name: string;
  displayName?: string;
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
  displayName?: string;
}

export interface RoleUpdateRequest {
  displayName?: string;
}
