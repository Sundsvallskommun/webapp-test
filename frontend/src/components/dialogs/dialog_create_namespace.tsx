import { Button, Dialog, Input, useSnackbar, SnackbarProps, IconProps } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import {
  getNamespace,
  isShortCodeAvailable,
  createNamespace,
} from '@services/supportmanagement-service/supportmanagement-namespace-service';

interface CreateNamespaceProps {
  open: boolean;
  municipality: MunicipalityInterface;
  onClose: (confirm: boolean, reloadDomainNameDropdown: boolean) => void;
}

export const DialogCreateNamespace: React.FC<CreateNamespaceProps> = ({ open, municipality, onClose }) => {
  const [namespaceInput, setNamespaceInput] = useState<string>('');
  const [namespaceInputChanged, setNamespaceInputChanged] = useState<boolean>(true);
  const [shortCodeInput, setShortCodeInput] = useState<string>('');
  const [displayNameInput, setDisplayNameInput] = useState<string>('');
  const [namespaceAvailable, setNamespaceAvailable] = useState<boolean>(false);
  const [shortCodeAvailable, setShortCodeAvailable] = useState<boolean>(false);
  const [shortCodeInputChanged, setShortCodeInputChanged] = useState<boolean>(true);
  
  const [savingNamespace, setSavingNamespace] = useState<boolean>(false);
  const snackBar = useSnackbar();
  const { t } = useTranslation();
  const escFunction = useCallback((e) => {
    if (e.key === 'Escape') {
      handleOnClose(false);
    }
  }, []);

  const handleOnClose = (reloadDomainNameDropdown: boolean) => {
    handleInputChange('');
    onClose(false, reloadDomainNameDropdown);
  };

  const handleInputChange = (value: string) => {
    const validNamespace = value.replace(/[^A-Z0-9_\\.]/gi, '');

    setNamespaceAvailable(false);
    setShortCodeInput('');
    setDisplayNameInput('');
    setNamespaceInputChanged(true);
    setNamespaceInput(validNamespace);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleVerifyNamespace();
    }
  };

  const handleVerifyNamespace = () => {
    if (namespaceInput.length > 0 && namespaceInputChanged) {
      getNamespace(municipality.municipalityId, namespaceInput.toUpperCase())
        .then((res) => {
          setShortCodeAvailable(true);
          setNamespaceInputChanged(false);
          setNamespaceAvailable(res === null);
          setShortCodeInput(res?.shortCode || '');
          setDisplayNameInput(res?.displayName || '');
        })
        .catch((e) => {
          handleError(
            'Error when verifying namespace name availability:',
            e,
            t('common:errors.errorVerifyingNamespaceName')
          );
        });
    }
  };

  const handleVerifyShortCode = () => {
    if (shortCodeInput.length === 0) return;

    isShortCodeAvailable(municipality.municipalityId, shortCodeInput)
    .then((res) => setShortCodeAvailable(res))
    .then(() => setShortCodeInputChanged(false));
  };

  const handleCreate = () => {
    setSavingNamespace(true);
    createNamespace(municipality.municipalityId, namespaceInput.toUpperCase(), {
      shortCode: shortCodeInput,
      displayName: displayNameInput,
    })
      .then(() => handleOnClose(true))
      .catch((e) => {
        handleError('Error when creating namespace:', e, t('common:errors.errorCreatingNamespace'));
      })
      .finally(() => setSavingNamespace(false));
  };

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

  const showDisplayIcon = (icon: string): React.ComponentPropsWithoutRef<IconProps['Component']>['id'] => {
    if (namespaceInputChanged) {
      return undefined;
    }
    if (icon === '') return undefined;
    return icon;
  };

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    setNamespaceAvailable(false);
  }, []);

  return (
    <Dialog
      show={open}
      label={`${t('common:dialogs.manage_namespace.header_new_namespace')} ${municipality?.name}`}
      className="md:min-w-[60rem] dialog"
    >
      <Dialog.Content>
        <div className="d-flex">
          <div>
            <p>{t('common:dialogs.manage_namespace.domain_name_input_heading')}:</p>
            <Input.Group>
              <Input.RightAddin icon>
                <Input
                  className={'upper-case'}
                  value={namespaceInput}
                  onKeyUp={(e) => handleEnter(e)}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onBlur={() => handleVerifyNamespace()}
                />
                <LucideIcon
                  name={namespaceAvailable ? showDisplayIcon('shield-check') : showDisplayIcon('shield-alert')}
                  color={namespaceAvailable ? 'gronsta' : 'warning'}
                />
              </Input.RightAddin>
            </Input.Group>
          </div>
          <div>
            <p>{t('common:dialogs.manage_namespace.short_code_input_heading')}:</p>
            <Input.Group
              disabled={!namespaceAvailable}
              invalid={
                (!namespaceInputChanged && shortCodeInput.length === 0) || !shortCodeAvailable ? true : undefined
              }
            >
              <Input.RightAddin icon>
                <Input
                  disabled={!namespaceAvailable}
                  className={'input-shortcode'}
                  maxLength={3}
                  value={shortCodeInput}
                  onChange={(e) => {setShortCodeInput(e.target.value); setShortCodeInputChanged(true);}}
                  onBlur={() => handleVerifyShortCode()}
                />
                <LucideIcon
                  name={
                    shortCodeAvailable || !namespaceAvailable ? showDisplayIcon('') : showDisplayIcon('shield-alert')
                  }
                  color={'warning'}
                />
              </Input.RightAddin>
            </Input.Group>
          </div>
        </div>
        {t('common:dialogs.manage_namespace.display_name_input_heading')}:{' '}
        <Input
          disabled={!namespaceAvailable}
          placeholder={t('common:dialogs.manage_namespace.displayname_placeholder')}
          invalid={!namespaceInputChanged && displayNameInput.length === 0 ? true : undefined}
          value={displayNameInput}
          onChange={(e) => setDisplayNameInput(e.target.value)}
        />
        <div>&nbsp;</div>
      </Dialog.Content>
      <Dialog.Buttons className={'container-right'}>

        <Button
          color={'vattjom'}
          leftIcon={<LucideIcon name={'save'} />} 
          disabled={!namespaceAvailable || shortCodeInput.length === 0 || displayNameInput.length === 0 || shortCodeInputChanged || !shortCodeAvailable}
          loading={savingNamespace}
          onClick={() => handleCreate()}
        >
          {t('common:buttons.create')}
        </Button>


        <Button 
          variant={'tertiary'} 
          leftIcon={<LucideIcon name={'folder-output'} />} 
          color={'vattjom'} 
          onClick={() => handleOnClose(false)}>
          {t('common:buttons.close')}
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};
