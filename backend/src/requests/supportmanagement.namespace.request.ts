import { NamespaceCreateRequestInterface, NamespaceUpdateRequestInterface } from '@/interfaces/supportmanagement.namespace.interface';
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
