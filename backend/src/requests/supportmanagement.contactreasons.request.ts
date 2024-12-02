import { ContactreasonCreateRequestInterface, ContactreasonUpdateRequestInterface } from '@/interfaces/supportmanagement.contactreasons.interface';
import { IsString } from 'class-validator';

export class ContactreasonCreateRequest implements ContactreasonCreateRequestInterface {
  @IsString()
  reason: string;
}

export class ContactreasonUpdateRequest implements ContactreasonUpdateRequestInterface {
  @IsString()
  reason: string;
}
