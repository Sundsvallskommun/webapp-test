import { apiService } from '../api-service';
import { Municipality, MunicipalitiesApiResponse, Namespace, NamespaceApiResponse, NamespacesApiResponse, NamespaceCreateRequest, NamespaceUpdateRequest } from '@data-contracts/backend/namespace-contracts';

export const getMunicipalities: () => Promise<Municipality[]> = async () => {
  const url = 'supportmanagement/municipality';

  return apiService
    .get<MunicipalitiesApiResponse>(url)
    .then((res) => mapToMunicipalities(res.data.data))
    .catch((e) => {
      console.error('Error occurred when fetching municipalities', e);
      throw e;
    });
};

const mapToMunicipalities: (res: Municipality[]) => Municipality[] = (data) => {
  return data.map(mapToMunicipality);
};

const mapToMunicipality: (res: Municipality) => Municipality = (data) => ({
  municipalityId: data.municipalityId,
  name: data.name,
});

export const getNamespaces: (municipalityId: string) => Promise<Namespace[]> = async (municipalityId) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace`;

  return apiService
    .get<NamespacesApiResponse>(url)
    .then((res) => mapToNamespaces(res.data.data))
    .catch((e) => {
      console.error('Error occurred when fetching namespaces', e);
      throw e;
    });
};

export const getNamespace: (municipalityId: string, namespace: string) => Promise<Namespace|null> = async (municipalityId, namespace) => {
  if (namespace.length < 1) return null;
  
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}`;
  return apiService
    .get<NamespaceApiResponse>(url)
    .then((res) => res.data.data ? mapToNamespace(res.data.data) : null)
    .catch((e) => {
      console.error('Error occurred when fetching namespace', e);
      throw e;
    });
};

const mapToNamespaces: (res: Namespace[]) => Namespace[] = (data) => {
  return data.map(mapToNamespace);
};

const mapToNamespace: (res: Namespace) => Namespace = (data) => ({
  namespace: data.namespace,
  displayname: data.displayname,
  description: data.description,
  shortCode: data.shortCode,
  created: data.created,
  modified: data.modified,
});

export const createNamespace: (municipalityId: string, request: NamespaceCreateRequest) => Promise<void> = async (municipalityId, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace`;
  return apiService
    .post<NamespaceCreateRequest>(url, request)
    .then(() => Promise.resolve())
    .catch((e) => {
      console.error('Error occurred when creating new namespace', e);
      throw e;
    });
};

export const updateNamespace: (municipalityId: string, namespace: string, request: NamespaceUpdateRequest) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}`;
  return apiService
    .patch<NamespaceUpdateRequest>(url, request)
    .then(() => Promise.resolve())
    .catch((e) => {
      console.error('Error occurred when updating new namespace', e);
      throw e;
    });
};

export const isShortCodeAvailable: (municipalityId: string, shortCode: string) => Promise<boolean> = async (municipalityId, shortCode) => {
  const url = `supportmanagement/municipality/${municipalityId}/shortcode/${shortCode}`;
  return apiService
    .get<boolean>(url)
    .then((res) => res.data)
    .catch((e) => {
      console.error('Error occurred when validating available short code', e);
      throw e;
    });
};
