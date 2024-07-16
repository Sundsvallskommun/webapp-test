import { Button, Dialog, Input, useSnackbar, Icon } from '@sk-web-gui/react';
import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
import { isRoleAvailable, createRole } from '@services/supportmanagement-service/supportmanagement-role-service';
import { MunicipalityInterface, NamespaceInterface } from '@interfaces/supportmanagement';

interface ManageRoleProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  onClose: (reloadPage: boolean) => void;
}

export const DialogManageRole: React.FC<ManageRoleProps> = ({ open, municipality, namespace, onClose }) => {
  const [roleInput, setRoleInput] = useState<string>('');
  const [roleAvailable, setRoleAvailable] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const snackBar = useSnackbar();
  const { t } = useTranslation();
  
  const handleOnClose = (reloadPage: boolean) => {
    setRoleInput('');
    onClose(reloadPage);
  };

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerifyRole();
    }
  };
  
  const handleInputChange = (input: string) => {
      setRoleAvailable(true);
      setVerified(false);
      setRoleInput(input);
  };
  
  const handleCreateRole = () => {
    isRoleAvailable(municipality.municipalityId, namespace.namespace, roleInput)
    .then((res) => {
      if (res) {
        setSaving(true)
        createRole(municipality.municipalityId, namespace.namespace, {
          "name": roleInput.toUpperCase()
        })
        .then(() => {
          setSaving(false);
          handleOnClose(true)})
        .catch((e) => {
          handleError('Error when creating role:', e, t('common:errors.errorCreatingRole'));
        });
      }
    })
    .catch((e) => {
      handleError('Error when verifying role name availability:', e, t('common:errors.errorVerifyingRolename'));
    });
  };
  
  const handleVerifyRole = () => {
    if (municipality && namespace && !verified && roleInput.length > 0) {
      isRoleAvailable(municipality.municipalityId, namespace.namespace, roleInput)
      .then((res) => {
        setRoleAvailable(res);
        setVerified(true);
      })
      .catch((e) => {
        handleError('Error when verifying role name availability:', e, t('common:errors.errorVerifyingRolename'));
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
    setRoleAvailable(true);
    setVerified(false);
    setSaving(false);
  }, []);

  return (
    <Dialog
      show={open} 
      label={`${t('common:dialogs.manage_role.header_prefix')} ${namespace?.displayname} ${t('common:in')} ${municipality?.name}`}
      className="md:min-w-[60rem] dialog"
    >
      <Dialog.Content>

        <p>{t('common:dialogs.manage_role.role_input_heading')}:</p> 
        <div className="d-flex">
          <div>
            <Input.Group
              invalid={(roleInput.length === 0) || !roleAvailable ? 'true' : undefined} 
            >
              <Input.RightAddin icon>
                <Input 
                  className={'upper-case'}
                  maxLength={17}
                  value={roleInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleEnter(e)}
                  onBlur={() => handleVerifyRole()}
                />
                <Icon 
                  name={roleAvailable ? '' : 'shield-x'}
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
          disabled={roleInput.length === 0 || !roleAvailable}
          loading={saving}
          color={'vattjom'}
          onClick={() => handleCreateRole()}>
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