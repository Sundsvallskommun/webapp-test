import { ApiResponse, apiService } from '../api-service';
import { ServiceResponse } from '@interfaces/services';
import { Municipality, MunicipalitiesApiResponse, Namespace, NamespaceApiResponse } from '@data-contracts/backend/data-contracts';

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

const mapToMunicipality: (res: Municipality) => Municipality = (res) => ({
  municipalityId: res.municipalityId,
  name: res.name,
});

export const getNamespaces: (municipalityId: number) => Promise<Namespace[]> = async (municipalityId) => {
  const url = `supportmanagement/${municipalityId}/namespace`;

  return apiService
    .get<NamespaceApiResponse>(url)
    .then((res) => mapToNamespaces(res.data.data))
    .catch((e) => {
      console.error('Error occurred when fetching namespaces', e);
      throw e;
    });
};

const mapToNamespaces: (res: Namespace[]) => Namespace[] = (data) => {
  return data.map(mapToNamespace);
};

const mapToNamespace: (res: Namespace) => Namespace = (res) => ({
  namespace: res.namespace,
  displayname: res.displayname,
  description: res.description,
  shortCode: res.shortCode,
  created: res.created,
  modified: res.modified,
});
