import { StatusCreateRequestInterface } from '@/interfaces/supportmanagement.statuses.interface';
import { IsString } from 'class-validator';

export class StatusCreateRequest implements StatusCreateRequestInterface {
  @IsString()
  name: string;
}
