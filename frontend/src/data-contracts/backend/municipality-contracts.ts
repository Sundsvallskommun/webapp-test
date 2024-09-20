export interface Municipality {
  municipalityId: string;
  name: string;
}

export interface MunicipalitiesApiResponse {
  data: Municipality[];
  message: string;
}
