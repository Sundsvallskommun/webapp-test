import { RoleCreateRequestInterface, RoleUpdateRequestInterface } from '@/interfaces/supportmanagement.roles.interface';
import { IsString, IsOptional } from 'class-validator';

export class RoleCreateRequest implements RoleCreateRequestInterface {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  displayName?: string;
}

export class RoleUpdateRequest implements RoleUpdateRequestInterface {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  displayName?: string;
}
