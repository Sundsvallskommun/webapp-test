import { Button, Dialog, Input, useSnackbar, Icon, SnackbarProps, IconProps } from '@sk-web-gui/react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import {
  isShortCodeAvailable,
  isMetadataPresent,
  updateNamespace,
  deleteNamespace,
} from '@services/supportmanagement-service/supportmanagement-namespace-service';

interface ModifyNamespaceProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  onClose: () => void;
}

export const DialogModifyNamespace: React.FC<ModifyNamespaceProps> = ({ open, municipality, namespace, onClose }) => {
  const [shortCodeInput, setShortCodeInput] = useState<string>('');
  const [displayNameInput, setDisplayNameInput] = useState<string>('');
  const [shortCodeAvailable, setShortCodeAvailable] = useState<boolean>(true);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [problemOpen, setProblemOpen] = useState<boolean>(false);
  const [savingNamespace, setSavingNamespace] = useState<boolean>(false);
  const snackBar = useSnackbar();
  const { t } = useTranslation();
  const escFunction = useCallback((e) => {
    if (e.key === 'Escape') {
      handleOnClose();
    }
  }, []);

  const handleOnClose = () => {
    onClose();
  };

  const handleVerifyShortCode = () => {
    if (shortCodeInput.length > 0 && shortCodeInput.toUpperCase() !== namespace?.shortCode.toUpperCase()) {
      isShortCodeAvailable(municipality.municipalityId, shortCodeInput)
      .then((res) => setShortCodeAvailable(res));
    } else {
      setShortCodeAvailable(true);
	}
  };

  const handleUpdate = () => {
    setSavingNamespace(true);
    updateNamespace(municipality.municipalityId, namespace.namespace, {
      shortCode: shortCodeInput,
      displayName: displayNameInput,
    })
      .then(() => handleOnClose())
      .catch((e) => {
        handleError('Error when updating namespace:', e, t('common:errors.errorUpdatingNamespace'));
      })
      .finally(() => setSavingNamespace(false));
  };

  const confirmDelete = () => {
	isMetadataPresent(municipality.municipalityId, namespace.namespace)
	.then((res) => res ? setProblemOpen(true) : setConfirmOpen(true) );
  };

  const handleOnAbort = () => {
    setConfirmOpen(false);
  };

  const handleDeleteNamespace = () => {
    setConfirmOpen(false);

    deleteNamespace(municipality.municipalityId, namespace.namespace)
    .then(() => setSavingNamespace(false))
    .then(() => handleOnClose())
    .catch((e) => {
      handleError('Error when deleting namespace:', e, t('common:errors.errorDeletingNamespace'));
    });
  }

  const handleError = (errorDescription: string, e: Error, message: string) => {
    console.error(errorDescription, e);
    displayMessage(message, 'error');
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

  const showDisplayIcon = (icon: string): React.ComponentPropsWithoutRef<IconProps['Component']>['name'] => {
    if (icon === '') return undefined;
    return icon as React.ComponentPropsWithoutRef<IconProps['Component']>['name'];
  };

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
	setShortCodeInput(namespace?.shortCode || '');
	setDisplayNameInput(namespace?.displayName || '');
  }, []);
  
  return (
    <Dialog
      show={open}
      label={`${t('common:dialogs.manage_namespace.header_update_namespace')} ${municipality?.name}`}
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
              {t('common:dialogs.manage_namespace.confirm_delete')}
            </div>
          </Dialog.Content>
          <Dialog.Buttons className={'container-right'}>
            <Button color={'vattjom'} onClick={() => handleDeleteNamespace()}>
              {t('common:buttons.confirm')}
            </Button>
            <Button variant={'tertiary'} color={'vattjom'} onClick={() => handleOnAbort()}>
              {t('common:buttons.abort')}
            </Button>
          </Dialog.Buttons>
        </Dialog>      

        <Dialog
          label={t('common:dialogs.manage_namespace.header_metadata_exists')}
          className="dialog"
          show={problemOpen}
        >
          <Dialog.Content>
            <div className="bottom-margin-50">
              {t('common:dialogs.manage_namespace.metadata_exists')}
            </div>
          </Dialog.Content>
          <Dialog.Buttons className={'container-right'}>
            <Button variant={'tertiary'} color={'vattjom'} onClick={() => setProblemOpen(false)}>
              {t('common:buttons.close')}
            </Button>
          </Dialog.Buttons>
        </Dialog>      

        <div className="d-flex">
          <div>
            <p>{t('common:dialogs.manage_namespace.domain_name_input_heading')}:</p>
            <Input.Group>
              <Input.RightAddin icon>
                <Input
                  disabled={true}
                  className={'upper-case'}
                  value={namespace?.namespace}
                />
              </Input.RightAddin>
            </Input.Group>
          </div>
          <div>
            <p>{t('common:dialogs.manage_namespace.short_code_input_heading')}:</p>
            <Input.Group
              invalid={
                (shortCodeInput.length === 0) || !shortCodeAvailable ? true : undefined
              }
            >
              <Input.RightAddin icon>
                <Input
                  className={'input-shortcode'}
                  maxLength={3}
                  value={shortCodeInput}
                  onChange={(e) => setShortCodeInput(e.target.value)}
                  onBlur={() => handleVerifyShortCode()}
                />
                <Icon
                  name={
                    shortCodeAvailable ? showDisplayIcon('') : showDisplayIcon('shield-alert')
                  }
                  color={'warning'}
                />
              </Input.RightAddin>
            </Input.Group>
          </div>
        </div>
        {t('common:dialogs.manage_namespace.display_name_input_heading')}:{' '}
        <Input
          placeholder={t('common:dialogs.manage_namespace.displayname_placeholder')}
          invalid={displayNameInput.length === 0 ? true : undefined}
          value={displayNameInput}
          onChange={(e) => setDisplayNameInput(e.target.value)}
        />
        <div>&nbsp;</div>
      </Dialog.Content>
      <Dialog.Buttons className={'container-right'}>
        <Button 
        disabled={!shortCodeInput || !shortCodeAvailable}
        loading={savingNamespace} color={'vattjom'} onClick={() => handleUpdate()}>
          {t('common:buttons.update')}
        </Button>
        <Button
          color={'juniskar'}
          onClick={() => confirmDelete()}
        >
          {t('common:buttons.delete')}
        </Button>
        <Button variant={'tertiary'} color={'vattjom'} onClick={() => handleOnClose()}>
          {t('common:buttons.close')}
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};
