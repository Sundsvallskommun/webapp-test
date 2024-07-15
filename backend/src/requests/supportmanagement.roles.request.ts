import { RoleCreateRequestInterface } from '@/interfaces/supportmanagement.roles.interface';
import { IsString } from 'class-validator';

export class RoleCreateRequest implements RoleCreateRequestInterface {
  @IsString()
  name: string;
}
