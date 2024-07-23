import { Button, Dialog, Input, Select, useSnackbar, Switch, Icon, Textarea, FormControl  } from '@sk-web-gui/react';
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from 'next-i18next';
import { MunicipalityInterface, NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { createEmailconfiguration, updateEmailconfiguration } from '@services/supportmanagement-service/supportmanagement-emailconfiguration-service';
import { EmailconfigurationInterface, EmailconfigurationCreateRequestInterface, EmailconfigurationUpdateRequestInterface } from '@interfaces/supportmanagement.emailconfiguration';
import { getRoles } from '@services/supportmanagement-service/supportmanagement-role-service';
import { RoleInterface } from '@interfaces/supportmanagement.role';
import { getStatuses } from '@services/supportmanagement-service/supportmanagement-status-service';
import { StatusInterface } from '@interfaces/supportmanagement.status';
import { isValidEmailOrEmpty } from '@utils/constants';

interface ManageEmailconfigurationProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  emailConfiguration: EmailconfigurationInterface | null;
  onClose: (reload:boolean) => void;
}

export const DialogManageEmailconfiguration: React.FC<ManageEmailconfigurationProps> = ({ open, municipality, namespace, emailConfiguration, onClose }) => {
  const { t } = useTranslation();
  const [futureEmailConfiguration, setFutureEmailConfiguration] = useState<EmailconfigurationCreateRequestInterface | EmailconfigurationUpdateRequestInterface>();
  const [saving, setSaving] = useState<boolean>(false);
  const [roles, setRoles] = useState<RoleInterface[]>([]);
  const [statuses, setStatuses] = useState<StatusInterface[]>([]);
  
  const snackBar = useSnackbar();
  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      handleOnClose(false);
    }
  }, []);
  
  const handleOnClose = (reload: boolean) => {
    onClose(reload);
  };

  const handleOnSave = () => {
    setSaving(true);
    console.log(futureEmailConfiguration);

    let response = emailConfiguration 
    ? updateEmailconfiguration(municipality.municipalityId, namespace.namespace, futureEmailConfiguration)
    : createEmailconfiguration(municipality.municipalityId, namespace.namespace, futureEmailConfiguration);
    
    response
      .then(() => handleOnClose(true))
      .catch((e) => {
        handleError('Error when saving configuration:', e, t('common:errors.errorSavingEmailconfiguration'));
	  })
	  .finally(() => setSaving(false));
  };

  const handleError = (errorDescription: string, e: Error, message: string) => {
    console.error(errorDescription, e);
    displayMessage(message, 'error');
  };

  const displayMessage = (message: string, messageType: string) => {
    snackBar({
      message: message,
      status: messageType,
      className: 'middle',
      position: 'top',
      closeable: false
    });
  };
  
  const washInput = (input: string): string => {
    const validatedInput = input.replace(/[^A-Z0-9_]/ig, "");
    return validatedInput ? String(validatedInput).toUpperCase() : validatedInput;	
  };
  
  const onlyNumbers = (input: string): number => {
    const validatedInput = input.replace(/[^\d.-]+/g, "");
    return Number(validatedInput);	
  };

  const handleToggleAddAsStakeholder = () => {
	const currentSetting = futureEmailConfiguration?.addSenderAsStakeholder || false;
    setFutureEmailConfiguration(
      {
        ...futureEmailConfiguration,
        addSenderAsStakeholder: !currentSetting
      });
  };
  
  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    setFutureEmailConfiguration({
      enabled: emailConfiguration?.enabled || false,
      errandClosedEmailSender: emailConfiguration?.errandClosedEmailSender,
      errandClosedEmailTemplate: emailConfiguration?.errandClosedEmailTemplate,
      daysOfInactivityBeforeReject: emailConfiguration?.daysOfInactivityBeforeReject,
      statusForNew: emailConfiguration?.statusForNew,
      triggerStatusChangeOn: emailConfiguration?.triggerStatusChangeOn,
      statusChangeTo: emailConfiguration?.statusChangeTo,
      inactiveStatus: emailConfiguration?.inactiveStatus,
      addSenderAsStakeholder: emailConfiguration?.addSenderAsStakeholder || false,
      stakeholderRole: emailConfiguration?.stakeholderRole,
      errandChannel: emailConfiguration?.errandChannel
    });
	
	// Load available roles
    getRoles(municipality.municipalityId, namespace.namespace)
      .then((res) => setRoles(res))
      .catch((e) => {
        handleError('Error when loading roles:', e, t('common:errors.errorLoadingRoles'));
      });

	// Load available statuses
    getStatuses(municipality.municipalityId, namespace.namespace)
      .then((res) => setStatuses(res))
      .catch((e) => {
        handleError('Error when loading statuses:', e, t('common:errors.errorLoadingStatuses'));
      });
	
  }, []);
  
  return (
    <Dialog
      show={open} 
      label={`${t('common:dialogs.manage_emailconfiguration.header_prefix')} ${namespace?.displayname} ${t('common:in')} ${municipality?.name}`}
      className="md:min-w-[100rem] dialog"
    >
      <Dialog.Content>
        {/* Section for activation and email recipient settings */} 
        <div className="grid-3-col section" >
          <div className="grid-2-col" >
            <div>
              {t('common:dialogs.manage_emailconfiguration.enable_configuration')}
            </div>
            <div>
              <Switch
                checked={futureEmailConfiguration?.enabled || false}
                onChange={() => setFutureEmailConfiguration(
                  {
                    ...futureEmailConfiguration,
                    enabled: !(futureEmailConfiguration?.enabled || false)
                  })
                }
              />
            </div>
          </div>              
          <div className="grid-2-col" >
            <div>
              {t('common:dialogs.manage_emailconfiguration.add_sender_as_stakeholder')}
            </div>
            <div>
              <Switch
                disabled={!futureEmailConfiguration?.enabled || !roles || roles?.length === 0}
                checked={futureEmailConfiguration?.addSenderAsStakeholder || false}
                onChange={() => handleToggleAddAsStakeholder()}
              />
            </div>
          </div>
          <div className="grid-2-col" >
            <div>
              {t('common:dialogs.manage_emailconfiguration.stakeholder_role')}
            </div>
            <div>
              <Select
                invalid={futureEmailConfiguration?.addSenderAsStakeholder && futureEmailConfiguration?.stakeholderRole === undefined}
                disabled={!futureEmailConfiguration?.enabled || !futureEmailConfiguration?.addSenderAsStakeholder}
                size={'sm'}
                value={futureEmailConfiguration?.stakeholderRole}
                onChange={(e) => setFutureEmailConfiguration(
                  {
                    ...futureEmailConfiguration,
                    stakeholderRole: e.target.value.length > 0 ? e.target.value : undefined
                  })
                }
              >
                <Select.Option value={''}>
                  {t('common:dialogs.manage_emailconfiguration.select_stakeholder_role')}
                </Select.Option>
                {roles.map(role => <Select.Option key={role.name} value={role.name}>
                  {role.name}
                </Select.Option>)}
              </Select>
            </div>
          </div>
        </div>

        {/* Section for rejection email */} 
        <div className="section" >
          <div className="grid-2-col" >
            <div className="grid-2-col">
              <div>
                {t('common:dialogs.manage_emailconfiguration.days_of_inactivity_before_reject')}
              </div>
              <div>
                <Input
                  disabled={!futureEmailConfiguration?.enabled}
                  className={'number-input'}
                  value={futureEmailConfiguration?.daysOfInactivityBeforeReject}
                  onChange={(e) => setFutureEmailConfiguration(
                    {
                      ...futureEmailConfiguration,
                      daysOfInactivityBeforeReject: onlyNumbers(e.target.value)
                    }
                  )}
                />
              </div>
            </div>
            <div className="grid-2-col">
              <div>
                {t('common:dialogs.manage_emailconfiguration.errand_closed_email_sender')}
              </div>
              <div>
                <Input
                  invalid={!isValidEmailOrEmpty(futureEmailConfiguration?.errandClosedEmailSender)}
                  disabled={!futureEmailConfiguration?.enabled}
                  placeholder={t('common:dialogs.manage_emailconfiguration.errand_closed_email_sender_placeholder')}
                  value={futureEmailConfiguration?.errandClosedEmailSender}
                  onChange={(e) => setFutureEmailConfiguration(
                    {
                      ...futureEmailConfiguration,
                      errandClosedEmailSender: e.target.value.toLowerCase()
                    }
                  )}
                />
              </div>
            </div>
          </div>

          <div className="small-text">
            <div>
              {t('common:dialogs.manage_emailconfiguration.errand_closed_email_template')}
            </div>
            <Textarea
              disabled={!futureEmailConfiguration?.enabled}
              placeholder={t('common:dialogs.manage_emailconfiguration.errand_closed_email_template_placeholder')}
              value={futureEmailConfiguration?.errandClosedEmailTemplate}
              className={'fill-available'}
              onChange={(e) => setFutureEmailConfiguration(
                {
                  ...futureEmailConfiguration,
                  errandClosedEmailTemplate: e.target.value
                })
              }
            />
          </div>
        </div>

        {/* Section for status changes */} 
        <div className="grid-4-col section" >
          <div>
            {t('common:dialogs.manage_emailconfiguration.errand_channel')}
          </div>
          <div>
            <Input
              disabled={!futureEmailConfiguration?.enabled}
              value={futureEmailConfiguration?.errandChannel}
              onChange={(e) => setFutureEmailConfiguration(
                {
                  ...futureEmailConfiguration,
                  errandChannel: washInput(e.target.value)
                }
              )}
            />
          </div>
          <div>
          </div>
          <div>
          </div>

          <div>
            {t('common:dialogs.manage_emailconfiguration.status_for_new')}
          </div>
          <div>
            <Select
              size={'sm'}
              disabled={!futureEmailConfiguration?.enabled}
              invalid={!futureEmailConfiguration?.statusForNew}
              value={futureEmailConfiguration?.statusForNew}
              onChange={(e) => setFutureEmailConfiguration(
                {
                  ...futureEmailConfiguration,
                  statusForNew: e.target.value.length > 0 ? e.target.value : undefined 
                })
              }
            >
              <Select.Option value={''}>
                {t('common:dialogs.manage_emailconfiguration.select_status')}
              </Select.Option>
              {statuses.map(status => <Select.Option key={status.name} value={status.name}>
                {status.name}
              </Select.Option>)}
            </Select>
          </div>

          <div>
            {t('common:dialogs.manage_emailconfiguration.trigger_statuschange_on')}
          </div>
          <div>
            <Select
              size={'sm'}
              disabled={!futureEmailConfiguration?.enabled}
              value={futureEmailConfiguration?.triggerStatusChangeOn}
              onChange={(e) => setFutureEmailConfiguration(
                {
                  ...futureEmailConfiguration,
                  triggerStatusChangeOn: e.target.value.length > 0 ? e.target.value : undefined
                })
              }
            >
              <Select.Option value={''}>
                {t('common:dialogs.manage_emailconfiguration.select_status')}
              </Select.Option>
              {statuses.map(status => <Select.Option key={status.name} value={status.name}>
                {status.name}
              </Select.Option>)}
            </Select>
          </div>

          <div>
            {t('common:dialogs.manage_emailconfiguration.inactive_status')}
          </div>
          <div>
            <Select
              size={'sm'}
              disabled={!futureEmailConfiguration?.enabled}
              value={futureEmailConfiguration?.inactiveStatus}
              onChange={(e) => setFutureEmailConfiguration(
                {
                  ...futureEmailConfiguration,
                  inactiveStatus: e.target.value.length > 0 ? e.target.value : undefined
                })
              }
            >
              <Select.Option value={''}>
                {t('common:dialogs.manage_emailconfiguration.select_status')}
              </Select.Option>
              {statuses.map(status => <Select.Option key={status.name} value={status.name}>
                {status.name}
              </Select.Option>)}
            </Select>
          </div>

          <div>
            {t('common:dialogs.manage_emailconfiguration.statuschange_to')}
          </div>
          <div>
            <Select
              size={'sm'}
              disabled={!futureEmailConfiguration?.enabled}
              value={futureEmailConfiguration?.statusChangeTo}
              onChange={(e) => setFutureEmailConfiguration(
                {
                  ...futureEmailConfiguration,
                  statusChangeTo: e.target.value.length > 0 ? e.target.value : undefined
                })
              }
            >
              <Select.Option value={''}>
                {t('common:dialogs.manage_emailconfiguration.select_status')}
              </Select.Option>
              {statuses.map(status => <Select.Option key={status.name} value={status.name}>
                {status.name}
              </Select.Option>)}
            </Select>
          </div>
        </div>
          
      </Dialog.Content>
      <Dialog.Buttons
        className={'container-right'}>

        <Button
          disabled={
            (futureEmailConfiguration?.addSenderAsStakeholder && futureEmailConfiguration?.stakeholderRole === undefined) ||
            (!futureEmailConfiguration?.statusForNew) ||
            (!isValidEmailOrEmpty(futureEmailConfiguration?.errandClosedEmailSender))
          }
          color={'vattjom'}
          loading={saving}
          onClick={() => handleOnSave()}>
          {emailConfiguration ?
            t('common:buttons.update')
          : 
            t('common:buttons.create')}
        </Button>

        <Button
          variant={'tertiary'}
          color={'vattjom'}
          onClick={() => handleOnClose(false)}>
          {t('common:buttons.close')}
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};