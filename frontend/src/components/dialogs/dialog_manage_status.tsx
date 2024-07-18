import { Button, Dialog, Input, useSnackbar, Icon } from '@sk-web-gui/react';
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from 'next-i18next';
import { isStatusAvailable, createStatus } from '@services/supportmanagement-service/supportmanagement-status-service';
import { MunicipalityInterface, NamespaceInterface } from '@interfaces/supportmanagement';

interface ManageStatusProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  onClose: (reloadPage: boolean) => void;
}

export const DialogManageStatus: React.FC<ManageStatusProps> = ({ open, municipality, namespace, onClose }) => {
  const [statusInput, setStatusInput] = useState<string>('');
  const [statusAvailable, setStatusAvailable] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const snackBar = useSnackbar();
  const { t } = useTranslation();
  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      handleOnClose(false);
    }
  }, []);
  
  const handleOnClose = (reloadPage: boolean) => {
    setStatusInput('');
    onClose(reloadPage);
  };

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerifyStatus();
    }
  };
  
  const handleInputChange = (input: string) => {
    setStatusAvailable(true);
    setVerified(false);
    setStatusInput(input.replace(/[^A-Z0-9_]/ig, ""));
  };
  
  const handleCreateStatus = () => {
    isStatusAvailable(municipality.municipalityId, namespace.namespace, statusInput)
    .then((res) => {
      if (res) {
        setSaving(true)
        createStatus(municipality.municipalityId, namespace.namespace, {
          "name": statusInput.toUpperCase()
        })
        .then(() => {
          setSaving(false);
          handleOnClose(true)})
        .catch((e) => {
          handleError('Error when creating status:', e, t('common:errors.errorCreatingStatus'));
        });
      }
    })
    .catch((e) => {
      handleError('Error when verifying status availability:', e, t('common:errors.errorVerifyingStatus'));
    });
  };
  
  const handleVerifyStatus = () => {
    if (municipality && namespace && !verified && statusInput.length > 0) {
      isStatusAvailable(municipality.municipalityId, namespace.namespace, statusInput)
      .then((res) => {
        setStatusAvailable(res);
        setVerified(true);
      })
      .catch((e) => {
        handleError('Error when verifying status availability:', e, t('common:errors.errorVerifyingStatus'));
      });
    }
  };

  const handleError = (errorDescription: string, e: Error, message: string) => {
    console.error(errorDescription, e);
    displayMessage(message, 'error');
    setSaving(false);
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

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    setStatusAvailable(true);
    setVerified(false);
    setSaving(false);
  }, []);

  return (
    <Dialog
      show={open} 
      label={`${t('common:dialogs.manage_status.header_prefix')} ${namespace?.displayname} ${t('common:in')} ${municipality?.name}`}
      className="md:min-w-[60rem] dialog"
    >
      <Dialog.Content>

        <div className="d-flex bottom-margin-50">
          <p>{t('common:dialogs.manage_status.status_input_heading')}:</p> 
          <div className="fill-available">
            <Input.Group
              invalid={(statusInput.length === 0) || !statusAvailable ? 'true' : undefined} 
            >
              <Input.RightAddin 
                icon
                className='fill-available'
              >
                <Input 
                  className={'upper-case'}
                  maxLength={250}
                  value={statusInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleEnter(e)}
                  onBlur={() => handleVerifyStatus()}
                />
                <Icon 
                  name={statusAvailable ? '' : 'shield-x'}
                  color={'error'}
                />
              </Input.RightAddin>
            </Input.Group>
          </div>
        </div>

      </Dialog.Content>
      <Dialog.Buttons
        className={'container-right'}
      >

        <Button
          disabled={statusInput.length === 0 || !statusAvailable}
          loading={saving}
          color={'vattjom'}
          onClick={() => handleCreateStatus()}>
          {t('common:buttons.create')}
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