import { apiService } from '../api-service';
import { EmailconfigurationResponse, EmailconfigurationCreateRequest, EmailconfigurationUpdateRequest } from '@data-contracts/backend/emailconfiguration-contracts';
import { EmailconfigurationInterface, EmailconfigurationCreateRequestInterface, EmailconfigurationUpdateRequestInterface } from '@interfaces/supportmanagement.emailconfiguration';

export const getEmailconfiguration: (municipalityId: string, namespace: string) => Promise<EmailconfigurationInterface | null> = async (municipalityId, namespace) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/emailconfiguration`;

  return apiService
    .get<EmailconfigurationResponse>(url)
    .then((res) => mapToEmailconfigurationInterface(res.data))
    .catch((e) => {
      if (e?.response?.status === 404) { // 404 means that the requested email configuration is not present in backend, return null
        return null;
      }
      
      console.error('Error occurred when fetching email configuration', e);
      throw e;
    });
};

const mapToEmailconfigurationInterface: (data: EmailconfigurationResponse) => EmailconfigurationInterface = (data) => ({
  enabled: data.enabled,
  errandClosedEmailSender: data.errandClosedEmailSender,
  errandClosedEmailTemplate: data.errandClosedEmailTemplate,
  daysOfInactivityBeforeReject: data.daysOfInactivityBeforeReject,
  statusForNew: data.statusForNew,
  triggerStatusChangeOn: data.triggerStatusChangeOn,
  statusChangeTo: data.statusChangeTo,
  inactiveStatus: data.inactiveStatus,
  addSenderAsStakeholder: data.addSenderAsStakeholder,
  stakeholderRole: data.stakeholderRole,
  errandChannel: data.errandChannel,
  created: data.created,
  modified: data.modified,
});

export const createEmailconfiguration: (municipalityId: string, namespace: string, request: EmailconfigurationCreateRequestInterface) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/emailconfiguration`;

  await apiService
    .post<EmailconfigurationCreateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when creating email configuration', e);
      throw e;
    });
};

export const updateEmailconfiguration: (municipalityId: string, namespace: string, request: EmailconfigurationUpdateRequestInterface) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/emailconfiguration`;

  await apiService
    .put<EmailconfigurationUpdateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when updating email comfiguration', e);
      throw e;
    });
};
