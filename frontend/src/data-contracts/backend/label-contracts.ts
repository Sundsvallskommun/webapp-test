export interface LabelsApiResponse {
  created: string;
  modified: string;
  labelStructure: Label[];
}

export interface Label {
  classification: string;
  displayName: string;
  name: string;
  uuid: string;
  labels: Label[];
}
