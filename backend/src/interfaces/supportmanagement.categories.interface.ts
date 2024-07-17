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

export interface CategoryTypeInputInterface {
  name: string;
  displayName?: string;
  escalationEmail?: string;
}

export interface CategoryCreateRequestInterface {
  name: string;
  displayName?: string;
  types?: CategoryTypeInputInterface[];
}

export interface CategoryUpdateRequestInterface {
  displayName?: string;
  types?: CategoryTypeInputInterface[];
}
