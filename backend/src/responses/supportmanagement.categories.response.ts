import ApiResponse from '@/interfaces/api-service.interface';
import { CategoryInterface, CategoryTypeInterface } from '@/interfaces/supportmanagement.categories.interface';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class CategoryType implements CategoryTypeInterface {
  @IsString()
  name: string;
  @IsString()
  displayName: string;
  @IsString()
  escalationEmail: string;
  @IsString()
  created: string;
  @IsString()
  modified?: string;
}

export class Category implements CategoryInterface {
  @IsString()
  name: string;
  @IsString()
  displayName: string;
  @IsString()
  created: string;
  @IsString()
  modified?: string;
  @ValidateNested()
  @Type(() => CategoryType)
  types: CategoryType[];
}

export class CategoriesResponse implements ApiResponse<Category[]> {
  @ValidateNested()
  @Type(() => Category)
  data: Category[];
  @IsString()
  message: string;
}

export class CategoryResponse implements ApiResponse<Category> {
  @ValidateNested()
  @Type(() => Category)
  data: Category;
  @IsString()
  message: string;
}