import { apiService } from '../api-service';
import { Role, RolesApiResponse, RoleApiResponse, RoleCreateRequest } from '@data-contracts/backend/data-contracts';

export const getRoles: (municipalityId: string, namespace: string) => Promise<Role[]> = async (municipalityId, namespace) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/roles`;

  return apiService
    .get<RolesApiResponse>(url)
    .then((res) => mapToRoles(res.data))
    .catch((e) => {
      console.error('Error occurred when fetching roles', e);
      throw e;
    });
};

const mapToRoles: (data: any) => Role[] = (data) => {
  return data.map(mapToRole);
};

const mapToRole: (data: Role) => Role = (data) => ({
  name: data.name,
  created: data.created,
  modified: data.modified,
});

export const isRoleAvailable: (municipalityId: string, namespace: string, role: string) => Promise<boolean> = async (municipalityId, namespace, role) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/roles/${role.toUpperCase()}`;

  return apiService
    .get<RoleApiResponse>(url)
    .then(() => false) // If response is returned, then category is present in backend
    .catch((e) => {
      if (e?.response?.status === 404) { // 404 means that the requested role is not present in backend
		return true;
	  }
	  
      console.error('Error occurred when fetching roles', e);
      throw e;
    });
};

export const createRole: (municipalityId: string, namespace: string, request: RoleCreateRequest) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/roles`;

  apiService
    .post<RoleCreateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when creating role', e);
      throw e;
    });
};
