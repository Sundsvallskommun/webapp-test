import ApiResponse from '@/interfaces/api-service.interface';
import { User } from '@/interfaces/users.interface';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class UserApiResponse implements ApiResponse<User> {
  @ValidateNested()
  data: User;
  @IsString()
  message: string;
}
