import { StatusCreateRequestInterface, StatusUpdateRequestInterface } from '@/interfaces/supportmanagement.statuses.interface';
import { IsString, IsOptional } from 'class-validator';

export class StatusCreateRequest implements StatusCreateRequestInterface {
  @IsString()
  name: string;
}

export class StatusUpdateRequest implements StatusUpdateRequestInterface {
  @IsString()
  @IsOptional()
  name?: string;
}
