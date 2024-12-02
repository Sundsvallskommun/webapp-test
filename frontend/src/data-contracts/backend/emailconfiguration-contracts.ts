export interface EmailconfigurationResponse {
  enabled: boolean;
  errandClosedEmailSender?: string;
  errandClosedEmailTemplate?: string;
  errandNewEmailSender?: string;
  errandNewEmailTemplate?: string;
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

export interface EmailconfigurationCreateRequest {
  enabled: boolean;
  errandClosedEmailSender?: string;
  errandClosedEmailTemplate?: string;
  errandNewEmailSender?: string;
  errandNewEmailTemplate?: string;
  daysOfInactivityBeforeReject?: number;
  statusForNew: string;
  triggerStatusChangeOn?: string;
  statusChangeTo?: string;
  inactiveStatus?: string;
  addSenderAsStakeholder?: boolean;
  stakeholderRole?: string;
  errandChannel?: string;
}

export interface EmailconfigurationUpdateRequest {
  enabled: boolean;
  errandClosedEmailSender?: string;
  errandClosedEmailTemplate?: string;
  errandNewEmailSender?: string;
  errandNewEmailTemplate?: string;
  daysOfInactivityBeforeReject?: number;
  statusForNew: string;
  triggerStatusChangeOn?: string;
  statusChangeTo?: string;
  inactiveStatus?: string;
  addSenderAsStakeholder?: boolean;
  stakeholderRole?: string;
  errandChannel?: string;
}
