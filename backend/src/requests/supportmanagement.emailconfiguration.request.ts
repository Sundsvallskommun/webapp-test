import { EmailConfigurationCreateRequestInterface, EmailConfigurationUpdateRequestInterface } from '@/interfaces/supportmanagement.emailconfiguration.interface';
import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class EmailConfigurationCreateRequest implements EmailConfigurationCreateRequestInterface {
  @IsBoolean()
  enabled: boolean;
  @IsString()
  @IsOptional()
  errandClosedEmailSender?: string;
  @IsString()
  @IsOptional()
  errandClosedEmailTemplate?: string;
  @IsNumber()
  @IsOptional()
  daysOfInactivityBeforeReject?: number;
  @IsString()
  statusForNew: string;
  @IsString()
  @IsOptional()
  triggerStatusChangeOn?: string;
  @IsString()
  @IsOptional()
  statusChangeTo?: string;
  @IsString()
  @IsOptional()
  inactiveStatus?: string;
  @IsBoolean()
  @IsOptional()
  addSenderAsStakeholder?: boolean;
  @IsString()
  @IsOptional()
  stakeholderRole?: string;
  @IsString()
  @IsOptional()
  errandChannel?: string;
}

export class EmailConfigurationUpdateRequest implements EmailConfigurationUpdateRequestInterface {
  @IsBoolean()
  enabled: boolean;
  @IsString()
  @IsOptional()
  errandClosedEmailSender?: string;
  @IsString()
  @IsOptional()
  errandClosedEmailTemplate?: string;
  @IsNumber()
  @IsOptional()
  daysOfInactivityBeforeReject?: number;
  @IsString()
  statusForNew: string;
  @IsString()
  @IsOptional()
  triggerStatusChangeOn?: string;
  @IsString()
  @IsOptional()
  statusChangeTo?: string;
  @IsString()
  @IsOptional()
  inactiveStatus?: string;
  @IsBoolean()
  @IsOptional()
  addSenderAsStakeholder?: boolean;
  @IsString()
  @IsOptional()
  stakeholderRole?: string;
  @IsString()
  @IsOptional()
  errandChannel?: string;
}
