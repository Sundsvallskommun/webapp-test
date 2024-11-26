import { apiService } from '../api-service';
import { Contactreason, ContactreasonsApiResponse, ContactreasonCreateRequest, ContactreasonUpdateRequest } from '@data-contracts/backend/contactreason-contracts';
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
  let i: number = 1;
  return data.map(entry => mapToContactreasonInterface(entry, i++));
};

const mapToContactreasonInterface: (data: Contactreason, i: number) => ContactreasonInterface = (data, i) => ({
  id: data.id,
  reason: data.reason,
  created: data.created,
  modified: data.modified,
  index: i,
});

export const isContactreasonAvailable: (municipalityId: string, namespace: string, contactreason: string) => Promise<boolean> = async (municipalityId, namespace, contactreason) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/contactreasons`;

  return apiService
    .get<ContactreasonsApiResponse>(url)
    .then((res) => mapToContactreasonInterfaces(res.data))
    .then((reasons) => !reasons.some(e => e.reason === contactreason)) // Loop through returned response and check if any is equal to sent in contract reason
    .catch((e) => {
      console.error('Error occurred when verifying if contactreason is available', e);
      throw e;
    });
};

export const createContactreason: (municipalityId: string, namespace: string, request: ContactreasonCreateRequest) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/contactreasons`;

  await apiService
    .post<ContactreasonCreateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when creating contactreason', e);
      throw e;
    });
};

export const updateContactreason: (municipalityId: string, namespace: string, id: number, request: ContactreasonUpdateRequest) => Promise<void> = async (municipalityId, namespace, id, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/contactreasons/${id}`;

  await apiService
    .patch<ContactreasonCreateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when updating contactreason', e);
      throw e;
    });
};

export const deleteContactreason: (municipalityId: string, namespace: string, id: number) => Promise<void> = async (municipalityId, namespace, id) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/contactreasons/${id}`;

  await apiService
    .delete(url)
    .catch((e) => {
      console.error('Error occurred when deleting contactreason', e);
      throw e;
    });
};
