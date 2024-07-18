import { apiService } from '../api-service';
import { Contactreason, ContactreasonsApiResponse, ContactreasonApiResponse, ContactreasonCreateRequest } from '@data-contracts/backend/contactreason-contracts';
import { ContactreasonInterface } from '@interfaces/supportmanagement.contactreason';

export const getContactreasons: (municipalityId: string, namespace: string) => Promise<ContactreasonInterface[]> = async (municipalityId, namespace) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/contactreasons`;

  return apiService
    .get<ContactreasonsApiResponse>(url)
    .then((res) => mapToContactreasonInterfaces(res.data))
    .catch((e) => {
      console.error('Error occurred when fetching contactreasons', e);
      throw e;
    });
};


const mapToContactreasonInterfaces: (data: any) => ContactreasonInterface[] = (data) => {
  return data.map(mapToContactreasonInterface);
};

const mapToContactreasonInterface: (data: Contactreason) => ContactreasonInterface = (data) => ({
  reason: data.reason,
  created: data.created,
  modified: data.modified,
});

export const isContactreasonAvailable: (municipalityId: string, namespace: string, contactreason: string) => Promise<boolean> = async (municipalityId, namespace, contactreason) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/contactreasons/${contactreason}`;

  return apiService
    .get<ContactreasonApiResponse>(url)
    .then(() => false) // If response is returned, then contract reason is present in backend
    .catch((e) => {
      if (e?.response?.status === 404) { // 404 means that the requested contract reason is not present in backend
        return true;
      }
  
      console.error('Error occurred when fetching contactreason', e);
      throw e;
    });
};

export const createContactreason: (municipalityId: string, namespace: string, request: ContactreasonCreateRequest) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/contactreasons`;

  apiService
    .post<ContactreasonCreateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when creating contactreason', e);
      throw e;
    });
};
