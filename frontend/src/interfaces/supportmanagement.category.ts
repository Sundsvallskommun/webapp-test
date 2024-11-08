export interface CategoryTypeInterface {
  name: string;
  displayName: string;
  escalationEmail: string;
  created: string;
  modified?: string;
}

export interface CategoryInterface {
  name: string;
  displayName: string;
  created: string;
  modified?: string;
  types?: CategoryTypeInterface[];
}

export interface CategoryTypeRequestInterface {
  name: string;
  displayName: string;
  escalationEmail?: string;
  existing: boolean;
}

export interface CategoryCreateRequestInterface {
  name: string;
  displayName: string;
  types?: CategoryTypeRequestInterface[];
}

export interface CategoryUpdateRequestInterface {
  name: string;
  displayName: string;
  types?: CategoryTypeRequestInterface[];
}
