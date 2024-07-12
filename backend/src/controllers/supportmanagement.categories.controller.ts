import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';

import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Body, Post, Param } from 'routing-controllers';
import { CategoryCreateRequest } from '@/requests/supportmanagement.request';
import { CategoriesResponse, CategoryResponse } from '@/responses/supportmanagement.response';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';

@Controller()
export class SupportmanagementCategoriesController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_SUPPORTMANAGEMENT;
                   
  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/categories')
  @OpenAPI({ summary: 'Returns all categories defined within provided municipalityId and namespace' })
  async getCategories(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string
  ): Promise<CategoriesResponse> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/categories`;

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
    @Param('category') category: string
  ): Promise<CategoryResponse> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/categories/${category}`;

    const res = await this.apiService.get<CategoryResponse>({ url })
    .catch(e => {
      logger.error('Error when retrieving category:', e);
      throw e;
    });

    return res.data;
  }

  @Post('/supportmanagement/municipality/:municipality/namespace/:namespace/categories')
  @OpenAPI({ summary: 'Creates a category for the provided municipality and namespace' })
  async createCategory(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Body() request: CategoryCreateRequest): Promise<void> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/categories`;

    await this.apiService.post<undefined>({ url: url, data: request })
    .catch(e => {
      logger.error('Error when creating category:', e);
      throw e;
    });
  }

};