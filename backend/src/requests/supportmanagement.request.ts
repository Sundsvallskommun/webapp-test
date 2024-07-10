import { NamespaceCreateRequestInterface, NamespaceUpdateRequestInterface, RoleCreateRequestInterface } from '@/interfaces/supportmanagement.interface';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class NamespaceCreateRequest implements NamespaceCreateRequestInterface {
  @IsString()
  namespace: string;
  @IsString()
  displayname: string;
  @IsString()
  description: string;
  @IsString()
  shortCode: string;
}

export class NamespaceUpdateRequest implements NamespaceUpdateRequestInterface {
  @IsString()
  displayname: string;
  @IsString()
  description: string;
}

export class RoleCreateRequest implements RoleCreateRequestInterface {
  @IsString()
  name: string;
}
