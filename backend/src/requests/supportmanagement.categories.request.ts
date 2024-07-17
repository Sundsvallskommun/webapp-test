import { CategoryTypeInputInterface, CategoryCreateRequestInterface, CategoryUpdateRequestInterface } from '@/interfaces/supportmanagement.categories.interface';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

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

export class CategoryUpdateRequest implements CategoryUpdateRequestInterface {
  @IsString()
  displayName?: string;
  @ValidateNested()
  @Type(() => CategoryTypeCreateInput)
  types?: CategoryTypeCreateInput[];
}
