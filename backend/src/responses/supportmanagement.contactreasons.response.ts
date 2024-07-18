import ApiResponse from '@/interfaces/api-service.interface';
import { ContactreasonInterface } from '@/interfaces/supportmanagement.contactreasons.interface';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class Contactreason implements ContactreasonInterface {
  @IsString()
  reason: string;
  @IsString()
  created: string;
  @IsString()
  modified?: string;
}

export class ContactreasonsResponse implements ApiResponse<Contactreason[]> {
  @ValidateNested()
  @Type(() => Contactreason)
  data: Contactreason[];
  @IsString()
  message: string;
}

export class ContactreasonResponse implements ApiResponse<Contactreason> {
  @ValidateNested()
  @Type(() => Contactreason)
  data: Contactreason;
  @IsString()
  message: string;
}
