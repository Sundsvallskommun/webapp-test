export interface LabelInterface {
  classification: string;
  displayName?: string;
  prefix?: string;
  name: string;
  uuid: string;
  isNew: boolean;
  isLeaf: boolean;
  labels?: LabelInterface[];
}

export interface LabelSaveRequestInterface {
  labels?: LabelInterface[];
}
