/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  name: string;
  username: string;
  givenName: string;
  surname: string;
}

export interface UserApiResponse {
  data: User;
  message: string;
}

export interface Municipality {
	municipalityId: number;
	name: string;
}

export interface MunicipalitiesApiResponse {
  data: Municipality[];
  message: string;
}

export interface Namespace {
	namespace: string;
	displayname: string;
	description: string;
	shortCode: string;
	created: string;
	modified: string;
}
 
export interface NamespaceApiResponse {
  data: Namespace[];
  message: string;
}