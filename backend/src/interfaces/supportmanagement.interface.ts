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
