import ApiResponse from '@interfaces/api-service.interface';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LabelInterface, LabelsInterface } from '@interfaces/supportmanagement.labels.interface';

export class LabelsResponse implements ApiResponse<Labels> {
  @ValidateNested()
  @Type(() => Labels)
  data: Labels;
  @IsString()
  message: string;
}

export class Labels implements LabelsInterface {
  @IsString()
  created: string;
  @IsString()
  modified: string;
  @ValidateNested()
  @Type(() => Label)
  labelStructure: Label[];
}

export class Label implements LabelInterface {
  @IsString()
  classification: string;
  @IsString()
  displayName?: string;
  @IsString()
  name: string;
  @ValidateNested()
  @Type(() => Label)
  labels?: Label[];
}
