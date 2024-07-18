import ApiResponse from '@/interfaces/api-service.interface';
import { StatusInterface } from '@/interfaces/supportmanagement.statuses.interface';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class Status implements StatusInterface {
  @IsString()
  name: string;
  @IsString()
  created: string;
  @IsString()
  modified?: string;
}

export class StatusesResponse implements ApiResponse<Status[]> {
  @ValidateNested()
  @Type(() => Status)
  data: Status[];
  @IsString()
  message: string;
}

export class StatusResponse implements ApiResponse<Status> {
  @ValidateNested()
  @Type(() => Status)
  data: Status;
  @IsString()
  message: string;
}
