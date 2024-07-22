export interface Municipality {
  municipalityId: string;
  name: string;
}

export interface MunicipalitiesApiResponse {
  data: Municipality[];
  message: string;
}

export interface Namespace {
  namespace: string;
  displayname: string;
  description: string;
  shortCode: string;
  created: string;
  modified?: string;
}
 
export interface NamespacesApiResponse {
  data: Namespace[];
  message: string;
}

export interface NamespaceApiResponse {
  data: Namespace;
  message: string;
}

export interface NamespaceCreateRequest {
  namespace: string;
  displayname: string;
  description: string;
  shortCode: string;
}

export interface NamespaceUpdateRequest {
  displayname: string;
  description: string;
}
