import { Button, Dialog, Input, useSnackbar, Icon, Textarea } from '@sk-web-gui/react';
import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
import { MunicipalityInterface } from '@interfaces/supportmanagement';
import { getNamespace, isShortCodeAvailable, createNamespace, updateNamespace } from '@services/supportmanagement-service/supportmanagement-service';

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
  const [descriptionInput, setDescriptionInput] = useState<string>('');
  const [namespaceAvailable, setNamespaceAvailable] = useState<boolean>(false);
  const [shortCodeAvailable, setShortCodeAvailable] = useState<boolean>(false);
  const [savingNamespace, setSavingNamespace] = useState<boolean>(false);
  const snackBar = useSnackbar();
  const { t } = useTranslation();
  
  const handleOnClose = (reloadDomainNameDropdown: boolean) => {
    handleInputChange('');
    onClose(false, reloadDomainNameDropdown);
  };

  const handleInputChange = (value: string) => {
    const validNamespace = value.replace(/[^A-Z0-9_]/ig, "");

    setNamespaceAvailable(false);
    setShortCodeInput('');
    setDisplayNameInput('');
    setDescriptionInput('');
    setNamespaceInputChanged(true);
    setNamespaceInput(validNamespace);
  };
  
  const handleEnter = (e: KeyboardEvent) => {
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
        setDisplayNameInput(res?.displayname || '');
        setDescriptionInput(res?.description || '');
      })
      .catch((e) => {
        handleError('Error when verifying namespace name availability:', e, t('common:errors.errorVerifyingNamespaceName'));
      });
    }
  };

  const handleVerifyShortCode = () => {
    if (shortCodeInput.length === 0) return;

    isShortCodeAvailable(municipality.municipalityId, shortCodeInput)
    .then((res) => setShortCodeAvailable(res));
  };
  
  const handleCreate = () => {
    setSavingNamespace(true);
    createNamespace(municipality.municipalityId, {
      "namespace": namespaceInput.toUpperCase(),
      "shortCode": shortCodeInput, 
      "displayname": displayNameInput,
      "description": descriptionInput
    })
    .then(() => handleOnClose(true))
    .catch((e) => {
      handleError('Error when updating namespace:', e, t('common:errors.errorCreatingNamespace'));
    })
    .finally(() => setSavingNamespace(false));
  };

  const handleUpdate = () => {
    setSavingNamespace(true);
    updateNamespace(municipality.municipalityId, namespaceInput.toUpperCase(), {
      "displayname": displayNameInput,
      "description": descriptionInput
    })
    .then(() => handleOnClose(true))
    .catch((e) => {
      handleError('Error when creating namespace:', e, t('common:errors.errorUpdatingNamespace'));
    })
    .finally(() => setSavingNamespace(false));
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

  const showDisplayIcon = (icon: string) :string => {
    if (namespaceInputChanged) {
      return '';
    }
    return icon;
  };
  
  useEffect(() => {
    setNamespaceAvailable(false);
  }, []);
   
  return (
    <Dialog
      show={open} 
      label={namespaceAvailable || namespaceInputChanged ? `${t('common:dialogs.manage_namespace.header_new_namespace')} ${municipality?.name}` : `${t('common:dialogs.manage_namespace.header_update_namespace')} ${municipality?.name}`}
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
                />
                <Icon 
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
              invalid={(!namespaceInputChanged && shortCodeInput.length === 0) || !shortCodeAvailable ? 'true' : undefined} 
            >
              <Input.RightAddin icon>
                <Input 
                  disabled={!namespaceAvailable}
                  className={'input-shortcode'}
                  maxLength={3}
                  value={shortCodeInput}
                  onChange={(e) => setShortCodeInput(e.target.value)}
                  onBlur={(e) => handleVerifyShortCode()}
                />
                <Icon 
                  name={shortCodeAvailable || !namespaceAvailable ? showDisplayIcon('') : showDisplayIcon('shield-alert')}
                  color={'warning'}
                />
              </Input.RightAddin>
            </Input.Group>
          </div>
        </div>

        {t('common:dialogs.manage_namespace.display_name_input_heading')}: <Input 
          disabled={namespaceInputChanged}
          placeholder={t('common:dialogs.manage_namespace.displayname_placeholder')}
          invalid={!namespaceInputChanged && displayNameInput.length === 0 ? 'true' : undefined} 
          value={displayNameInput}
          onChange={(e) => setDisplayNameInput(e.target.value)}
        />

        <div>

          <p>{t('common:dialogs.manage_namespace.description_input_heading')}: </p>
          <Textarea 
            disabled={namespaceInputChanged}
            className={'container-max-width'}
            invalid={!namespaceInputChanged && descriptionInput.length === 0 ? 'true' : undefined} 
            showCount={true}
            rows={5}
            maxLength={150}
            placeholder={t('common:dialogs.manage_namespace.description_placeholder')}
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
          />

        </div>
      </Dialog.Content>
      <Dialog.Buttons
        className={'container-right'}>

        {namespaceInputChanged  &&
        <Button
          color={'vattjom'}
          disabled={!namespaceInput || namespaceInput.length === 0}
          onClick={() => handleVerifyNamespace()}>
          {t('common:buttons.verify_domain')}
        </Button>
        }
        
        {!namespaceInputChanged && namespaceAvailable &&
        <Button
          color={'vattjom'}
          disabled={shortCodeInput.length === 0 || displayNameInput.length === 0 || descriptionInput.length === 0 || !shortCodeAvailable}
          loading={savingNamespace}
          onClick={() => handleCreate()}>
          {t('common:buttons.create_domain')}
        </Button>
        }
        
        {!namespaceInputChanged && !namespaceAvailable &&
        <Button
          loading={savingNamespace}
          color={'vattjom'}
          onClick={() => handleUpdate()}>
          {t('common:buttons.update_domain')}
        </Button>
        }
        
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