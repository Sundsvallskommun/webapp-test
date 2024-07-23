import ApiResponse from '@/interfaces/api-service.interface';
import { EmailConfigurationInterface } from '@/interfaces/supportmanagement.emailconfiguration.interface';
import { Type } from 'class-transformer';
import { IsString, IsBoolean, ValidateNested } from 'class-validator';

export class EmailConfiguration implements EmailConfigurationInterface {
  @IsBoolean()
  enabled: boolean;
  @IsString()
  errandClosedEmailSender?: string;
  @IsString()
  errandClosedEmailTemplate?: string;
  @IsString()
  daysOfInactivityBeforeReject?: number;
  @IsString()
  statusForNew: string;
  @IsString()
  triggerStatusChangeOn?: string;
  @IsString()
  statusChangeTo?: string;
  @IsString()
  inactiveStatus?: string;
  @IsBoolean()
  addSenderAsStakeholder?: boolean;
  @IsString()
  stakeholderRole?: string;
  @IsString()
  errandChannel?: string;
  @IsString()
  created: string;
  @IsString()
  modified?: string;
}
export class EmailConfigurationResponse implements ApiResponse<EmailConfiguration> {
  @ValidateNested()
  @Type(() => EmailConfiguration)
  data: EmailConfiguration;
  @IsString()
  message: string;
}