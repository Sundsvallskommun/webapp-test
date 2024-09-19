import { apiService } from '../api-service';
import { Municipality, MunicipalitiesApiResponse } from '@data-contracts/backend/municipality-contracts';

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
