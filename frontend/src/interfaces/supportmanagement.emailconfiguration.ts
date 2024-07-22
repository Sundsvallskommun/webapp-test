export interface EmailconfigurationInterface {
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

export interface EmailconfigurationCreateRequestInterface {
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

export interface EmailconfigurationUpdateRequestInterface {
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
