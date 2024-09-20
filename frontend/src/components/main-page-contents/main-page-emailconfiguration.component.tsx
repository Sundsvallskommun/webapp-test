import { Button, useSnackbar, Card, Header, Text } from '@sk-web-gui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { getEmailconfiguration } from '@services/supportmanagement-service/supportmanagement-emailconfiguration-service';
import { EmailconfigurationInterface } from '../../interfaces/supportmanagement.emailconfiguration';
import { DialogManageEmailconfiguration } from '@components/dialogs/dialog_manage_emailconfiguration';
import { toReadableTimestamp } from '@utils/dateformat';
import { v4 } from 'uuid';

interface MainPageEmailsettingsProps {
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
}

export const MainPageEmailConfigurationContent: React.FC<MainPageEmailsettingsProps> = ({ municipality, namespace }) => {
  const [emailconfiguration, setEmailconfiguration] = useState<EmailconfigurationInterface>();
  const [isHandleEmailconfigurationDialogOpen, setIsHandleEmailconfigurationDialogOpen] = useState<boolean>(false);
  const snackBar = useSnackbar();
  const { t } = useTranslation();

  const handleError = (errorDescription: string, e: Error, message: string) => {
    console.error(errorDescription, e);
    snackBar({
      message: message,
      status: 'error',
      position: 'top',
      closeable: false
    });
  };
 
  const loadEmailconfiguration = () => {
    if (municipality && namespace) {
      getEmailconfiguration(municipality.municipalityId, namespace.namespace)
        .then((res) => setEmailconfiguration(res))
        .catch((e) => {
          handleError('Error when loading emailconfiguration:', e, t('common:errors.errorLoadingEmailconfiguration'));
        });
    }
  };

  const closeHandleEmailconfigurationDialog = (reloadTable: boolean) => {
    if (reloadTable) {
      loadEmailconfiguration();
    }
    setIsHandleEmailconfigurationDialogOpen(false);
  };

  useEffect(() => {
    loadEmailconfiguration();
  } ,[]);
  
  return (
    <>
    <DialogManageEmailconfiguration
      key={v4()} 
      open={isHandleEmailconfigurationDialogOpen}
      municipality={municipality}
      namespace={namespace}
      emailConfiguration={emailconfiguration}
      onClose={closeHandleEmailconfigurationDialog}
    />
      {emailconfiguration ?
      <>
        <Card>
          <Card.Header className="card-header">
            <span>
              {t('common:subpages.emailconfiguration.current_email_configuration')} 
            </span>
          </Card.Header>
          <Card.Body>
            <div className="section" >
              <div className="grid-2-col no-borders">
                <div>
                  {t('common:subpages.emailconfiguration.configuration_enabled')}
                </div>
                <div>
                  <span className="capitalize-first">{emailconfiguration.enabled && t('common:yes')}{!emailconfiguration.enabled && t('common:no')}</span>
                </div>

                <div>
                  {t('common:subpages.emailconfiguration.add_sender_as_stakeholder')}
                </div>
                <div>
                  <span className="capitalize-first">{emailconfiguration.addSenderAsStakeholder && t('common:yes')}{!emailconfiguration.addSenderAsStakeholder && t('common:no')}</span>
                </div>

                <div>
                  {t('common:subpages.emailconfiguration.stakeholder_role')}
                </div>
                <div>
                  {emailconfiguration.stakeholderRole}
                </div>
              </div>
            </div>
            
            <div className="section" >
              <div className="grid-2-col no-borders">
                <div>
                  {t('common:subpages.emailconfiguration.days_of_inactivity_before_reject')}
                </div>
                <div>
                  {emailconfiguration.daysOfInactivityBeforeReject}
                </div>
              
                <div>
                  {t('common:subpages.emailconfiguration.errand_closed_email_sender')}
                </div>
                <div>
                  {emailconfiguration.errandClosedEmailSender}
                </div>
              
                <div>
                  {t('common:subpages.emailconfiguration.errand_closed_email_template')}
                </div>
                <div>
                  <Text 
                    className={'sk-max-width-40'}
                  >
                    {emailconfiguration.errandClosedEmailTemplate}
                  </Text>
                </div>
              </div>
            </div>

            <div className="section" >
              <div className="grid-2-col no-borders">
                <div>
                  {t('common:subpages.emailconfiguration.errand_channel')}
                </div>
                <div>
                  {emailconfiguration.errandChannel}
                </div>

                <div>
                  {t('common:subpages.emailconfiguration.status_for_new')}
                </div>
                <div>
                  {emailconfiguration.statusForNew}
                </div>

                <div>
                  {t('common:subpages.emailconfiguration.trigger_statuschange_on')}
                </div>
                <div>
                  {emailconfiguration.triggerStatusChangeOn}
                </div>

                <div>
                  {t('common:subpages.emailconfiguration.statuschange_to')}
                </div>
                <div>
                  {emailconfiguration.statusChangeTo}
                </div>

                <div>
                  {t('common:subpages.emailconfiguration.inactive_status')}
                </div>
                <div>
                  {emailconfiguration.inactiveStatus}
                </div>
              </div>
            </div>
            <span className="capitalize-first created-span">
              {t('common:subpages.emailconfiguration.created')} {toReadableTimestamp(emailconfiguration.created)}
              {emailconfiguration.modified &&
                <>, {t('common:subpages.emailconfiguration.modified')} {toReadableTimestamp(emailconfiguration.modified)}</>
              }
            </span>
          </Card.Body>
        </Card>
        <Button
          color={'vattjom'}
          onClick={() => setIsHandleEmailconfigurationDialogOpen(true)}>
          {t('common:buttons.modify_emailconfiguration')}
        </Button>
      </>
      :
      <>
        <Card color={'tertiary'}>
          <Card.Body>
            <Card.Text>
              <div className="capitalize-first">
                {t('common:subpages.emailconfiguration.missing')}
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
        <Button
          color={'vattjom'}
          onClick={() => setIsHandleEmailconfigurationDialogOpen(true)}>
          {t('common:buttons.add_emailconfiguration')}
        </Button>
      </>}
    </>
  );
};
