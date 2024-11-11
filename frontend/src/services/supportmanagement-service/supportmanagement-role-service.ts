import { apiService } from '../api-service';
import { Role, RolesApiResponse, RoleApiResponse, RoleCreateRequest } from '@data-contracts/backend/role-contracts';
import { RoleInterface, RoleCreateRequestInterface } from '@interfaces/supportmanagement.role';

export const getRoles: (municipalityId: string, namespace: string) => Promise<RoleInterface[]> = async (municipalityId, namespace) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/roles`;

  return apiService
    .get<RolesApiResponse>(url)
    .then((res) => mapToRoleInterfaces(res.data))
    .catch((e) => {
      console.error('Error occurred when fetching roles', e);
      throw e;
    });
};

const mapToRoleInterfaces: (data: any) => RoleInterface[] = (data) => {
  let i: number = 1;
  return data.map(entry => mapToRoleInterface(entry, i++));
};

const mapToRoleInterface: (data: Role, i: number) => RoleInterface = (data, i) => ({
  name: data.name,
  created: data.created,
  modified: data.modified,
  index: i,
});

export const isRoleAvailable: (municipalityId: string, namespace: string, role: string) => Promise<boolean> = async (municipalityId, namespace, role) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/roles/${role.toUpperCase()}`;

  return apiService
    .get<RoleApiResponse>(url)
    .then(() => false) // If response is returned, then role is present in backend
    .catch((e) => {
      if (e?.response?.status === 404) { // 404 means that the requested role is not present in backend
        return true;
      }
  
      console.error('Error occurred when fetching role', e);
      throw e;
    });
};

export const createRole: (municipalityId: string, namespace: string, request: RoleCreateRequestInterface) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/roles`;

  apiService
    .post<RoleCreateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when creating role', e);
      throw e;
    });
};
