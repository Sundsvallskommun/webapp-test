import ApiResponse from '@/interfaces/api-service.interface';
import { MunicipalityInterface, NamespaceInterface, RoleInterface } from '@/interfaces/supportmanagement.interface';
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
  displayname: string;
  @IsString()
  description: string;
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

export class Role implements RoleInterface {
  @IsString()
  name: string;
  @IsString()
  created: string;
  @IsString()
  modified?: string;
}

export class RolesResponse implements ApiResponse<Role[]> {
  @ValidateNested()
  @Type(() => Role)
  data: Role[];
  @IsString()
  message: string;
}

export class RoleResponse implements ApiResponse<Role> {
  @ValidateNested()
  @Type(() => Role)
  data: Role;
  @IsString()
  message: string;
}