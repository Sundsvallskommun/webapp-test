import { Button, Dialog, Input, useSnackbar, SnackbarProps } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import {
  isContactreasonAvailable,
  createContactreason,
  updateContactreason,
  deleteContactreason
} from '@services/supportmanagement-service/supportmanagement-contactreason-service';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { ContactreasonInterface } from '@interfaces/supportmanagement.contactreason';

interface ManageContactreasonProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  existingContactreason: ContactreasonInterface;
  onClose: () => void;
}

export const DialogManageContactreason: React.FC<ManageContactreasonProps> = ({
  open,
  municipality,
  namespace,
  existingContactreason,
  onClose,
}) => {
  const [contactreasonInput, setContactreasonInput] = useState<string>('');
  const [contactreasonAvailable, setContactreasonAvailable] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const snackBar = useSnackbar();
  const { t } = useTranslation();
  const escFunction = useCallback((event) => {
    if (event.key === 'Escape') {
      handleOnClose();
    }
  }, []);

  const handleOnClose = () => {
    setContactreasonInput('');
    onClose();
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
          setSaving(true);
          createContactreason(municipality.municipalityId, namespace.namespace, {
            reason: contactreasonInput.trim(),
          })
            .then(() => {
              setSaving(false);
              handleOnClose();
            })
            .catch((e) => {
              handleError('Error when creating contactreason:', e, t('common:errors.errorCreatingContactreason'));
            });
        }
      })
      .catch((e) => {
        handleError(
          'Error when verifying contactreason availability:',
          e,
          t('common:errors.errorVerifyingContactreason')
        );
      });
  };

  const handleUpdateContactreason = () => {
    setSaving(true);
    updateContactreason(municipality.municipalityId, namespace.namespace, existingContactreason.id, {
      reason: contactreasonInput.trim(),
    })
    .then(() => {
      setSaving(false);
      handleOnClose();
    })
    .catch((e) => {
      handleError('Error when updating contactreason:', e, t('common:errors.errorUpdatingContactreason'));
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
          handleError(
            'Error when verifying contractreason availability:',
            e,
            t('common:errors.errorVerifyingContactreason')
          );
        });
    }
  };

  const confirmDelete = () => {
    setConfirmOpen(true);
  };

  const handleOnAbort = () => {
    setConfirmOpen(false);
  };
    
  const handleDeleteContactreason = () => {
    setConfirmOpen(false);

    deleteContactreason(municipality.municipalityId, namespace.namespace, existingContactreason.id)
    .then(() => {
      setSaving(false);
      handleOnClose();
    })
    .catch((e) => {
      handleError('Error when deleting contactreason:', e, t('common:errors.errorDeletingContactreason'));
    });
  }

  const handleError = (errorDescription: string, e: Error, message: string) => {
    console.error(errorDescription, e);
    displayMessage(message, 'error');
    setSaving(false);
  };

  const displayMessage = (message: string, messageType: SnackbarProps['status']) => {
    snackBar({
      message: message,
      status: messageType,
      className: 'middle',
      position: 'top',
      closeable: false,
    });
  };

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    if (existingContactreason != null && existingContactreason != undefined) {
      setContactreasonInput(existingContactreason.reason);
    }

    setContactreasonAvailable(true);
    setVerified(false);
    setSaving(false);
  }, []);

  return (
    <Dialog
      show={open}
      label={existingContactreason ? `${t('common:dialogs.manage_contactreason.header_prefix_modify')} ${namespace?.displayName} ${t('common:in')} ${municipality?.name}` : 
         `${t('common:dialogs.manage_contactreason.header_prefix_create')} ${namespace?.displayName} ${t('common:in')} ${municipality?.name}`}
      className="md:min-w-[60rem] dialog"
    >
      <Dialog.Content>
        <Dialog
          label={t('common:dialogs.confirm_header')}
          className="dialog"
          show={confirmOpen}
        >
          <Dialog.Content>
            <div className="bottom-margin-50">
              {t('common:dialogs.manage_contactreason.confirm_delete')}
            </div>
          </Dialog.Content>
          <Dialog.Buttons className={'container-right'}>
            <Button 
              color={'vattjom'} 
              leftIcon={<LucideIcon name={'check-square'} />} 
              onClick={() => handleDeleteContactreason()}>
              {t('common:buttons.confirm')}
            </Button>
            <Button 
              variant={'tertiary'} 
              color={'vattjom'} 
              leftIcon={<LucideIcon name={'square-x'} />} 
              onClick={() => handleOnAbort()}>
              {t('common:buttons.abort')}
            </Button>
          </Dialog.Buttons>
        </Dialog>      

        <div className="d-flex bottom-margin-50">
          <p>{t('common:dialogs.manage_contactreason.contactreason_input_heading')}:</p>
          <div className="fill-available">
            <Input.Group invalid={contactreasonInput.length === 0 || !contactreasonAvailable ? true : undefined}>
              <Input.RightAddin icon className="fill-available">
                <Input
                  maxLength={250}
                  value={contactreasonInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleEnter(e)}
                  onBlur={() => handleVerifyContactreason()}
                />
                <LucideIcon name={contactreasonAvailable ? undefined : 'shield-x'} color={'error'} />
              </Input.RightAddin>
            </Input.Group>
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Buttons className={'container-right'}>
        <Button
          leftIcon={<LucideIcon name={'save'} />} 
          disabled={contactreasonInput.length === 0 || !contactreasonAvailable ||(existingContactreason && existingContactreason.reason == contactreasonInput)}
          loading={saving}
          color={'vattjom'}
          onClick={() => existingContactreason ? handleUpdateContactreason() : handleCreateContactreason()}
        >
          {existingContactreason ? t('common:buttons.update') : t('common:buttons.create')}
        </Button>
        {existingContactreason &&
          <Button
            color={'juniskar'}
            leftIcon={<LucideIcon name={'trash-2'} />} 
            onClick={() => confirmDelete()}
          >
            {t('common:buttons.delete')}
          </Button>
        }
        <Button 
          variant={'tertiary'} 
          leftIcon={<LucideIcon name={'folder-output'} />} 
          color={'vattjom'} 
          onClick={() => handleOnClose()}>
          {t('common:buttons.close')}
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};
