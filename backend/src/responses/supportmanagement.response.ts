import ApiResponse from '@/interfaces/api-service.interface';
import { MunicipalityInterface, NamespaceInterface } from '@/interfaces/supportmanagement.interface';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class Municipality implements MunicipalityInterface {
  @IsNumber()
  municipalityId: number;
  @IsString()
  name: string;
}

export class MunicipalitiesResponse implements ApiResponse<Municipality[]> {
  @ValidateNested()
  @Type(() => Municipality)
  data: Municipality[];
  @IsString()
  message: string;
}

export class Namespace implements NamespaceInterface {
  @IsString()
  namespace: string;
  @IsString()
  displayname: string;
  @IsString()
  description: string;
  @IsString()
  shortCode: string;
  @IsString()
  created: string;
  @IsString()
  modified: string;
}

export class NamespacesResponse implements ApiResponse<Namespace[]> {
  @ValidateNested()
  @Type(() => Namespace)
  data: Namespace[];
  @IsString()
  message: string;
}
