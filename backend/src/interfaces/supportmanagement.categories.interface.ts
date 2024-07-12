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

export interface CategoryCreateRequestInterface {
  // Right now only an empty interface, will be defined later
}
