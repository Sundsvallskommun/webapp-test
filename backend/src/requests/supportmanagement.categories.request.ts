import { CategoryCreateRequestInterface, CategoryTypeInputInterface } from '@/interfaces/supportmanagement.categories.interface';
import { Type } from 'class-transformer';
import { IsString, IsEmail, ValidateNested } from 'class-validator';

export class CategoryTypeCreateInput implements CategoryTypeInputInterface {
  @IsString()
  name: string;
  @IsString()
  displayName?: string;
  @IsString()
  escalationEmail?: string;
}
	
export class CategoryCreateRequest implements CategoryCreateRequestInterface {
  @IsString()
  name: string;
  @IsString()
  displayName?: string;
  @ValidateNested()
  @Type(() => CategoryTypeCreateInput)
  types?: CategoryTypeCreateInput[];
}
