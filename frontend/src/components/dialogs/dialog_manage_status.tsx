import { Button, Dialog, Input, useSnackbar, SnackbarProps } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { isStatusAvailable, createStatus, updateStatus, deleteStatus } from '@services/supportmanagement-service/supportmanagement-status-service';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { StatusInterface } from '@interfaces/supportmanagement.status';

interface ManageStatusProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  existingStatus: StatusInterface;
  onClose: () => void;
}

export const DialogManageStatus: React.FC<ManageStatusProps> = ({ open, municipality, namespace, existingStatus, onClose }) => {
  const [statusInput, setStatusInput] = useState<string>('');
  const [statusAvailable, setStatusAvailable] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [currentStatusName, setCurrentStatusName] = useState<string>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const snackBar = useSnackbar();
  const { t } = useTranslation();
  const escFunction = useCallback((event) => {
    if (event.key === 'Escape') {
      handleOnClose();
    }
  }, []);

  const handleOnClose = () => {
    setStatusInput('');
    onClose();
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleVerifyStatus();
    }
  };

  const handleInputChange = (input: string) => {
    setStatusAvailable(true);
    setVerified(false);
    setStatusInput(input.replace(/[^A-Z0-9_\\.]/gi, ''));
  };

  const handleCreateStatus = () => {
    isStatusAvailable(municipality.municipalityId, namespace.namespace, statusInput)
      .then((res) => {
        if (res) {
          setSaving(true);
          createStatus(municipality.municipalityId, namespace.namespace, {
            name: statusInput.toUpperCase(),
          })
            .then(() => {
              setSaving(false);
              handleOnClose();
            })
            .catch((e) => {
              handleError('Error when creating status:', e, t('common:errors.errorCreatingStatus'));
            });
        }
      })
      .catch((e) => {
        handleError('Error when verifying status availability:', e, t('common:errors.errorVerifyingStatus'));
      });
  };

  const handleUpdateStatus = () => {
    isStatusAvailable(municipality.municipalityId, namespace.namespace, statusInput)
    .then((res) => {
      if (res || existingStatus.name === statusInput) {
        setSaving(true);
        updateStatus(municipality.municipalityId, namespace.namespace, currentStatusName, {
          name: statusInput.toUpperCase(),
        })
        .then(() => {
          setSaving(false);
          handleOnClose();
        })
        .catch((e) => {
          handleError('Error when updating role:', e, t('common:errors.errorUpdatingRole'));
        });
      }
    })
    .catch((e) => {
      handleError('Error when verifying role name availability:', e, t('common:errors.errorVerifyingStatus'));
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

  const confirmDelete = () => {
    setConfirmOpen(true);
  };

  const handleOnAbort = () => {
    setConfirmOpen(false);
  };
    
  const handleDeleteStatus = () => {
    setConfirmOpen(false);

    deleteStatus(municipality.municipalityId, namespace.namespace, currentStatusName)
    .then(() => {
      setSaving(false);
      handleOnClose();
    })
    .catch((e) => {
      handleError('Error when deleting status:', e, t('common:errors.errorDeletingStatus'));
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
    if (existingStatus != null && existingStatus != undefined) {
      setCurrentStatusName(existingStatus.name);
      setStatusInput(existingStatus.name);
    }

    setStatusAvailable(true);
    setVerified(false);
    setSaving(false);
  }, []);

  return (
    <Dialog
      show={open}
      label={existingStatus ? `${t('common:dialogs.manage_status.header_prefix_modify')} ${namespace?.displayName} ${t('common:in')} ${municipality?.name}` : 
         `${t('common:dialogs.manage_status.header_prefix_create')} ${namespace?.displayName} ${t('common:in')} ${municipality?.name}`}
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
              {t('common:dialogs.manage_status.confirm_delete')}
            </div>
          </Dialog.Content>
          <Dialog.Buttons className={'container-right'}>
            <Button 
              leftIcon={<LucideIcon name={'check-square'} />} 
              color={'vattjom'} 
              onClick={() => handleDeleteStatus()}>
              {t('common:buttons.confirm')}
            </Button>
            <Button 
              variant={'tertiary'} 
              leftIcon={<LucideIcon name={'square-x'} />} 
              color={'vattjom'} 
              onClick={() => handleOnAbort()}>
              {t('common:buttons.abort')}
            </Button>
          </Dialog.Buttons>
        </Dialog>      

        <div className="d-flex bottom-margin-50">
          <p>{t('common:dialogs.manage_status.status_input_heading')}:</p>
          <div className="fill-available">
            <Input.Group invalid={statusInput.length === 0 || !statusAvailable ? true : undefined}>
              <Input.RightAddin icon className="fill-available">
                <Input
                  disabled={existingStatus != null} // Existing status name can not be updated 
                  className={'upper-case'}
                  maxLength={250}
                  value={statusInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleEnter(e)}
                  onBlur={() => handleVerifyStatus()}
                />
                <LucideIcon name={statusAvailable ? undefined : 'shield-x'} color={'error'} />
              </Input.RightAddin>
            </Input.Group>
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Buttons className={'container-right'}>
        <Button
          className={existingStatus ? 'hidden' : ''} /* Update is hidden until patch is supported by backing api-service */
          leftIcon={<LucideIcon name={'save'} />} 
          disabled={statusInput.length === 0 || !statusAvailable}
          loading={saving}
          color={'vattjom'}
          onClick={() => existingStatus ? handleUpdateStatus() : handleCreateStatus()}
        >
          {existingStatus ? t('common:buttons.update') : t('common:buttons.create')}
        </Button>
        {existingStatus &&
          <Button
            leftIcon={<LucideIcon name={'trash-2'} />} 
            color={'juniskar'}
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
