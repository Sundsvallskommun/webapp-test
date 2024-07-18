import { apiService } from '../api-service';
import { Category, CategoriesApiResponse, CategoryApiResponse, CategoryCreateRequest, CategoryUpdateRequest, CategoryType } from '@data-contracts/backend/category-contracts';
import { CategoryInterface, CategoryTypeInterface, CategoryCreateRequestInterface, CategoryUpdateRequestInterface } from '@interfaces/supportmanagement.category';

export const getCategories: (municipalityId: string, namespace: string) => Promise<CategoryInterface[]> = async (municipalityId, namespace) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/categories`;

  return apiService
    .get<CategoriesApiResponse>(url)
    .then((res) => mapToCategories(res.data))
    .catch((e) => {
      console.error('Error occurred when fetching categories', e);
      throw e;
    });
};

const mapToCategories: (data: any) => CategoryInterface[] = (data) => {
  return data.map(mapToCategory);
};

const mapToCategory: (data: Category) => CategoryInterface = (data) => ({
  name: data.name,
  displayName: data.displayName,
  created: data.created,
  modified: data.modified,
  types: mapToTypes(data.types)
});

const mapToTypes: (data: CategoryType[]) => CategoryTypeInterface[] = (data) => {
    return data.map(mapToType);
}

const mapToType: (data: CategoryType) => CategoryTypeInterface = (data) => ({
    name: data.name,
    displayName: data.displayName,
    escalationEmail: data.escalationEmail,
    created: data.created,
    modified: data.modified,
    existing: true
});


export const isCategoryAvailable: (municipalityId: string, namespace: string, role: string) => Promise<boolean> = async (municipalityId, namespace, category) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/categories/${category.toUpperCase()}`;

  return apiService
    .get<CategoryApiResponse>(url)
    .then(() => false) // If response is returned, then category is present in backend
    .catch((e) => {
      if (e?.response?.status === 404) { // 404 means that the requested category is not present in backend
        return true;
      }
  
      console.error('Error occurred when fetching categories', e);
      throw e;
    });
};

export const createCategory: (municipalityId: string, namespace: string, request: CategoryCreateRequestInterface) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/categories`;

  await apiService
    .post<CategoryCreateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when creating category', e);
      throw e;
    });

  await new Promise(r => setTimeout(r, 500)); 
};

export const updateCategory: (municipalityId: string, namespace: string, request: CategoryUpdateRequestInterface) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/categories/${request.name.toUpperCase()}`;

  await apiService
    .patch<CategoryUpdateRequest>(url, request)
    .catch((e) => {
      console.error('Error occurred when updating category', e);
      throw e;
    });

  await new Promise(r => setTimeout(r, 500)); 
};
