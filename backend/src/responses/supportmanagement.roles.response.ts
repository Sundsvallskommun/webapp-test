import ApiResponse from '@/interfaces/api-service.interface';
import { RoleInterface } from '@/interfaces/supportmanagement.roles.interface';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

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
