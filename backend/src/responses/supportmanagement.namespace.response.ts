import ApiResponse from '@/interfaces/api-service.interface';
import { MunicipalityInterface, NamespaceInterface, MetadataInterface } from '@/interfaces/supportmanagement.namespace.interface';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class Municipality implements MunicipalityInterface {
  @IsString()
  municipalityId: string;
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
  municipalityId: string;
  @IsString()
  displayName: string;
  @IsString()
  shortCode: string;
  @IsString()
  created: string;
  @IsString()
  modified?: string;
}

export class NamespacesResponse implements ApiResponse<Namespace[]> {
  @ValidateNested()
  @Type(() => Namespace)
  data: Namespace[];
  @IsString()
  message: string;
}

export class NamespaceResponse implements ApiResponse<Namespace> {
  @ValidateNested()
  @Type(() => Namespace)
  data: Namespace;
  @IsString()
  message: string;
}

export class MetadataResponse implements MetadataInterface {
  categories: object[];
  externalIdTypes: object[];
  labels: object[];
  statuses: object[];
  roles: object[];
  contactReasons: object[];
}
