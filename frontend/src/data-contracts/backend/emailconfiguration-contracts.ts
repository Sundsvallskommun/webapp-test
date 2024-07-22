export interface EmailConfiguration {
  enabled: boolean;
  errandClosedEmailSender?: string;
  errandClosedEmailTemplate?: string;
  daysOfInactivityBeforeReject?: number;
  statusForNew: string;
  triggerStatusChangeOn?: string;
  statusChangeTo?: string;
  inactiveStatus?: string;
  addSenderAsStakeholder?: boolean;
  stakeholderRole?: string;
  errandChannel?: string;
  created: string;
  modified?: string;
}

export interface EmailConfigurationApiResponse {
  data: EmailConfiguration;
  message: string;
}

export interface EmailConfigurationCreateRequest {
  enabled: boolean;
  errandClosedEmailSender?: string;
  errandClosedEmailTemplate?: string;
  daysOfInactivityBeforeReject?: number;
  statusForNew: string;
  triggerStatusChangeOn?: string;
  statusChangeTo?: string;
  inactiveStatus?: string;
  addSenderAsStakeholder?: boolean;
  stakeholderRole?: string;
  errandChannel?: string;
}

export interface EmailConfigurationUpdateRequest {
  enabled: boolean;
  errandClosedEmailSender?: string;
  errandClosedEmailTemplate?: string;
  daysOfInactivityBeforeReject?: number;
  statusForNew: string;
  triggerStatusChangeOn?: string;
  statusChangeTo?: string;
  inactiveStatus?: string;
  addSenderAsStakeholder?: boolean;
  stakeholderRole?: string;
  errandChannel?: string;
}
