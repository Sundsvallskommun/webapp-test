export interface MunicipalityInterface {
  municipalityId: string;
  name: string;
}

export interface NamespaceInterface {
  namespace: string;
  displayname: string;
  description: string;
  shortCode: string;
  created: string;
  modified?: string;
}

export interface NamespaceCreateRequestInterface {
  namespace: string;
  displayname: string;
  description: string;
  shortCode: string;
}

export interface NamespaceUpdateRequestInterface {
  displayname: string;
  description: string;
}

export interface RoleInterface {
  name: string;
  created: string;
  modified?: string;
}

export interface RoleCreateRequestInterface {
  name: string;
}

export interface CategoryTypeInterface {
  name: string;
  displayName: string;
  escalationEmail: string;
  created: string;
  modified?: string;
}

export interface CategoryInterface {
  name: string;
  displayName: string;
  created: string;
  modified?: string;
  types?: CategoryTypeInterface[];
}

export interface CategoryCreateRequestInterface {
  // Right now only an empty interface, will be defined later
}
