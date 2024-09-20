export interface MunicipalityInterface {
  municipalityId: string;
  name: string;
}

export interface NamespaceInterface {
  namespace: string;
  municipalityId: string;
  displayName: string;
  shortCode: string;
  created: string;
  modified?: string;
}

export interface NamespaceCreateRequestInterface {
  displayName: string;
  shortCode: string;
}

export interface NamespaceUpdateRequestInterface {
  displayName: string;
  shortCode: string;
}
