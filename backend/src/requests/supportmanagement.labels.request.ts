import { LabelInterface, LabelSaveRequestInterface } from '@/interfaces/supportmanagement.labels.interface';

export class LabelSaveRequest implements LabelSaveRequestInterface {
  labels: LabelInterface[];
}
