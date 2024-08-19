export interface CreateLabelInterface {
  name: string;
  classification: string;
  displayname?: string;
  isActualLabel: boolean;
  uuid: string;
  label?: CreateLabelInterface[];
}