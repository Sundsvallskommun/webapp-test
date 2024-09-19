export interface Namespace {
  namespace: string;
  municipalityId: string;
  displayName: string;
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
  displayName: string;
  shortCode: string;
}

export interface NamespaceUpdateRequest {
  displayName: string;
  shortCode: string;
}
