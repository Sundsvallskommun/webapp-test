import { apiService } from '../api-service';
import { Status, StatusesApiResponse, StatusApiResponse, StatusCreateRequest, StatusUpdateRequest } from '@data-contracts/backend/status-contracts';
import { StatusInterface, StatusCreateRequestInterface, StatusUpdateRequestInterface } from '@interfaces/supportmanagement.status';

export const getStatuses: (municipalityId: string, namespace: string) => Promise<StatusInterface[]> = async (municipalityId, namespace) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/statuses`;

  return apiService
    .get<StatusesApiResponse>(url)
    .then((res) => mapToStatusInterfaces(res.data))
    .catch((e) => {
      console.error('Error occurred when fetching statuses', e);
      throw e;
    });
};

const mapToStatusInterfaces: (data: any) => StatusInterface[] = (data) => {
  let i: number = 1;
  return data.map(entry => mapToStatusInterface(entry, i++));
};

const mapToStatusInterface: (data: Status, i: number) => StatusInterface = (data, i) => ({
  name: data.name,
  created: data.created,
  modified: data.modified,
  index: i,
});

export const isStatusAvailable: (municipalityId: string, namespace: string, status: string) => Promise<boolean> = async (municipalityId, namespace, status) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/statuses/${status.toUpperCase()}`;

  return apiService
    .get<StatusApiResponse>(url)
    .then(() => false) // If response is returned, then status is present in backend
    .catch((e) => {
      if (e?.response?.status === 404) { // 404 means that the requested status is not present in backend
        return true;
      }
  
      console.error('Error occurred when fetching status', e);
      throw e;
    });
};

export const createStatus: (municipalityId: string, namespace: string, request: StatusCreateRequestInterface) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/statuses`;

  await apiService
    .post<StatusCreateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when creating status', e);
      throw e;
    });
};

export const updateStatus: (municipalityId: string, namespace: string, roleName: string, request: StatusUpdateRequestInterface) => Promise<void> = async (municipalityId, namespace, statusName, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/statuses/${statusName}`;

  await apiService
    .patch<StatusUpdateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when updating role', e);
      throw e;
    });
};

export const deleteStatus: (municipalityId: string, namespace: string, statusName: string) => Promise<void> = async (municipalityId, namespace, statusName) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/statuses/${statusName}`;

  await apiService
    .delete(url)
    .catch((e) => {
      console.error('Error occurred when deleting status', e);
      throw e;
    });
};
