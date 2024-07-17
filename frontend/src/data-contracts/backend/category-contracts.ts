export interface CategoryType {
  name: string;
  displayName: string;
  escalationEmail: string;
  created: string;
  modified?: string;
}

export interface Category {
  name: string;
  displayName: string;
  created: string;
  modified?: string;
  types?: CategoryType[];
}

export interface CategoriesApiResponse {
  data: Category[];
  message: string;
}

export interface CategoryApiResponse {
  data: Category;
  message: string;
}

export interface CategoryTypeRequest {
  name: string;
  displayName: string;
  escalationEmail?: string;
}

export interface CategoryCreateRequest {
  name: string;
  displayName: string;
  types?: CategoryTypeRequest[];
}

export interface CategoryUpdateRequest {
  displayName: string;
  types?: CategoryTypeRequest[];
}
