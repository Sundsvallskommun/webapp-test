import { Button, Dialog, Input, useSnackbar, Icon } from '@sk-web-gui/react';
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from 'next-i18next';
import { isContactreasonAvailable, createContactreason } from '@services/supportmanagement-service/supportmanagement-contactreason-service';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';

interface ManageContactreasonProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  onClose: (reloadPage: boolean) => void;
}

export const DialogManageContactreason: React.FC<ManageContactreasonProps> = ({ open, municipality, namespace, onClose }) => {
  const [contactreasonInput, setContactreasonInput] = useState<string>('');
  const [contactreasonAvailable, setContactreasonAvailable] = useState<boolean>(false);
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
    setContactreasonInput('');
    onClose(reloadPage);
  };

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerifyContactreason();
    }
  };
  
  const handleInputChange = (input: string) => {
    setContactreasonAvailable(true);
    setVerified(false);
    setContactreasonInput(input);
  };
  
  const handleCreateContactreason = () => {
    isContactreasonAvailable(municipality.municipalityId, namespace.namespace, contactreasonInput.trim())
    .then((res) => {
      if (res) {
        setSaving(true)
        createContactreason(municipality.municipalityId, namespace.namespace, {
          "reason": contactreasonInput.trim()
        })
        .then(() => {
          setSaving(false);
          handleOnClose(true)})
        .catch((e) => {
          handleError('Error when creating contactreason:', e, t('common:errors.errorCreatingContactreason'));
        });
      }
    })
    .catch((e) => {
      handleError('Error when verifying contactreason availability:', e, t('common:errors.errorVerifyingContactreason'));
    });
  };
  
  const handleVerifyContactreason = () => {
    if (municipality && namespace && !verified && contactreasonInput.length > 0) {
      isContactreasonAvailable(municipality.municipalityId, namespace.namespace, contactreasonInput.trim())
      .then((res) => {
        setContactreasonAvailable(res);
        setContactreasonInput(contactreasonInput.trim());
        setVerified(true);
      })
      .catch((e) => {
        handleError('Error when verifying contractreason availability:', e, t('common:errors.errorVerifyingContactreason'));
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
    setContactreasonAvailable(true);
    setVerified(false);
    setSaving(false);
  }, []);

  return (
    <Dialog
      show={open} 
      label={`${t('common:dialogs.manage_contactreason.header_prefix')} ${namespace?.displayName} ${t('common:in')} ${municipality?.name}`}
      className="md:min-w-[60rem] dialog"
    >
      <Dialog.Content>

        <div className="d-flex bottom-margin-50">
          <p>{t('common:dialogs.manage_contactreason.contactreason_input_heading')}:</p> 
          <div className="fill-available">
            <Input.Group
              invalid={(contactreasonInput.length === 0) || !contactreasonAvailable ? 'true' : undefined} 
            >
              <Input.RightAddin 
                icon
                className='fill-available'
              >
                <Input 
                  maxLength={250}
                  value={contactreasonInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleEnter(e)}
                  onBlur={() => handleVerifyContactreason()}
                />
                <Icon 
                  name={contactreasonAvailable ? '' : 'shield-x'}
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
          disabled={contactreasonInput.length === 0 || !contactreasonAvailable}
          loading={saving}
          color={'vattjom'}
          onClick={() => handleCreateContactreason()}>
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