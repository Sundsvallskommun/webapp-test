import { apiService } from '../api-service';
import { LabelsApiResponse } from '@data-contracts/backend/label-contracts';

export const getLabels: (municipality: string, namespace: string) => Promise<LabelsApiResponse> = async (municipality, namespace) => {
  const url = `/supportmanagement/municipality/${municipality}/namespace/${namespace}/labels`;

  console.log('Fetching labels from', url);

  const result = apiService
    .get<LabelsApiResponse>(url)
    .then((res) => res.data)
    .catch((e) => {
      console.error('Error occurred when fetching namespaces', e);
      throw e;
    });

  return result;
};
