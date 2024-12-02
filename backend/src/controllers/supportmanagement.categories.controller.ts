import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';

import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Body, Post, Patch, Delete, Param, HttpCode } from 'routing-controllers';
import { CategoryCreateRequest, CategoryUpdateRequest } from '@/requests/supportmanagement.categories.request';
import { CategoriesResponse, CategoryResponse } from '@/responses/supportmanagement.categories.response';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';

@Controller()
export class SupportmanagementCategoriesController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_SUPPORTMANAGEMENT;

  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/categories')
  @OpenAPI({ summary: 'Returns all categories defined within provided municipalityId and namespace' })
  async getCategories(@Param('municipality') municipality: string, @Param('namespace') namespace: string): Promise<CategoriesResponse> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata/categories`;

    const res = await this.apiService.get<CategoriesResponse>({ url }).catch(e => {
      logger.error('Error when retrieving categories:', e);
      throw e;
    });

    return res.data;
  }

  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/categories/:category')
  @OpenAPI({ summary: 'Returns category matching the provided parameters' })
  async getCategory(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Param('category') category: string,
  ): Promise<CategoryResponse> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata/categories/${category}`;

    const res = await this.apiService.get<CategoryResponse>({ url }).catch(e => {
      logger.error('Error when retrieving category:', e);
      throw e;
    });

    return res.data;
  }

  @Post('/supportmanagement/municipality/:municipality/namespace/:namespace/categories')
  @OpenAPI({ summary: 'Creates a category for the provided municipality and namespace' })
  @HttpCode(201)
  async createCategory(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Body() request: CategoryCreateRequest,
  ): Promise<boolean> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata/categories`;

    await this.apiService.post<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when creating category:', e);
      throw e;
    });

    return true;
  }

  @Patch('/supportmanagement/municipality/:municipality/namespace/:namespace/categories/:category')
  @OpenAPI({ summary: 'Updates a category matching the provided municipality, namespace and category' })
  @HttpCode(201)
  async updateCategory(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Param('category') category: string,
    @Body() request: CategoryUpdateRequest,
  ): Promise<boolean> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata/categories/${category}`;

    await this.apiService.patch<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when updating category:', e);
      throw e;
    });

    return true;
  }

  @Delete('/supportmanagement/municipality/:municipality/namespace/:namespace/categories/:category')
  @OpenAPI({ summary: 'Delete a category matching the provided municipality, namespace and category' })
  @HttpCode(204)
  async deleteCategory(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Param('category') category: string,
  ): Promise<boolean> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata/categories/${category}`;

    await this.apiService.delete({ url: url }).catch(e => {
      logger.error('Error when deleting category:', e);
      throw e;
    });

    return true;
  }
}
