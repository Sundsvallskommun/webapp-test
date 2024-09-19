import { NamespaceCreateRequestInterface, NamespaceUpdateRequestInterface } from '@/interfaces/supportmanagement.namespace.interface';
import { IsString } from 'class-validator';

export class NamespaceCreateRequest implements NamespaceCreateRequestInterface {
  @IsString()
  displayName: string;
  @IsString()
  shortCode: string;
}

export class NamespaceUpdateRequest implements NamespaceUpdateRequestInterface {
  @IsString()
  displayName: string;
  @IsString()
  shortCode: string;
}
