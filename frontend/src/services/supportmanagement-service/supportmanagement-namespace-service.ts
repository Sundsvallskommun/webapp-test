import { apiService } from '../api-service';
import { Namespace, NamespaceApiResponse, NamespacesApiResponse, NamespaceCreateRequest, NamespaceUpdateRequest } from '@data-contracts/backend/namespace-contracts';

export const getNamespaces: (municipalityId: string) => Promise<Namespace[]> = async (municipalityId) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespaces`;

  return apiService
    .get<NamespacesApiResponse>(url)
    .then((res) => mapToNamespaces(res.data))
    .catch((e) => {
      console.error('Error occurred when fetching namespaces', e);
      throw e;
    });
};

export const getNamespace: (municipalityId: string, namespace: string) => Promise<Namespace|null> = async (municipalityId, namespace) => {
  if (namespace.length < 1) return null;
  
  const url = `supportmanagement/municipality/${municipalityId}/namespaces/${namespace}`;
  return apiService
    .get<any>(url)
    .then((res) => res.data ? mapToNamespace(res.data) : null)
    .catch((e) => {
      if (e.response.status === 404) { // Not considered to be an error in the UI
        return null;
      }
      
      console.error('Error occurred when fetching namespace', e);
      throw e;
    });
};

const mapToNamespaces: (data: any) => Namespace[] = (data) => {
  return data.map(mapToNamespace)
    .toSorted((a, b) => a.displayName.localeCompare(b.displayName));
};

const mapToNamespace: (res: Namespace) => Namespace = (data) => ({
  namespace: data.namespace,
  municipalityId: data.municipalityId,
  displayName: data.displayName,
  shortCode: data.shortCode,
  created: data.created,
  modified: data.modified,
});

export const isShortCodeAvailable: (municipalityId: string, shortCode: string) => Promise<boolean> = async (municipalityId, shortCode) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespaces`;
  return apiService
    .get<NamespaceApiResponse>(url)
    .then((res) => res.data ? !shortCodePresent(res.data, shortCode) : true)
    .catch((e) => {
      console.error('Error occurred when validating available short code', e);
      throw e;
    });
};

const shortCodePresent: (data: any, shortCode: string) => boolean = (data, shortCode) => {
  const existingShortCode = data.find(m => m.shortCode.toLocaleUpperCase() === shortCode.toLocaleUpperCase())?.shortCode || null;
  return existingShortCode !== null;	
};

export const createNamespace: (municipalityId: string, namepspace: string, request: NamespaceCreateRequest) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespaces/${namespace}`;
  return apiService
    .post<NamespaceCreateRequest>(url, request)
    .then(() => Promise.resolve())
    .catch((e) => {
      console.error('Error occurred when creating new namespace', e);
      throw e;
    });
};

export const updateNamespace: (municipalityId: string, namespace: string, request: NamespaceUpdateRequest) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespaces/${namespace}`;
  return apiService
    .put<NamespaceUpdateRequest>(url, request)
    .then(() => Promise.resolve())
    .catch((e) => {
      console.error('Error occurred when updating new namespace', e);
      throw e;
    });
};
