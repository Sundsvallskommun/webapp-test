export interface LabelsApiResponse {
  created: string;
  modified: string;
  labelStructure: Label[];
}

export interface Label {
  classification: string;
  displayName?: string;
  name: string;
  labels?: Label[];
}

export interface LabelSaveRequest {
  labelStructure?: Label[];
}
