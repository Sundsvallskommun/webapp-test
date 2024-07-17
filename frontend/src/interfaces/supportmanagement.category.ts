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
}

export interface CategoryRequestInterface {
  name: string;
  displayName: string;
  types?: CategoryTypeRequestInterface[];
}
