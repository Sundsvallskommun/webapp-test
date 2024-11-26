import { Button, Dialog, Input, useSnackbar, Icon, SnackbarProps } from '@sk-web-gui/react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { isRoleAvailable, createRole, updateRole, deleteRole } from '@services/supportmanagement-service/supportmanagement-role-service';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { RoleInterface } from '@interfaces/supportmanagement.role';

interface ManageRoleProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  existingRole: RoleInterface;
  onClose: () => void;
}

export const DialogManageRole: React.FC<ManageRoleProps> = ({ open, municipality, namespace, existingRole, onClose }) => {
  const [roleInput, setRoleInput] = useState<string>('');
  const [displayNameInput, setDisplayNameInput] = useState<string>(null);
  const [roleAvailable, setRoleAvailable] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [currentRoleName, setCurrentRoleName] = useState<string>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const snackBar = useSnackbar();
  const { t } = useTranslation();
  const escFunction = useCallback((event) => {
    if (event.key === 'Escape') {
      handleOnClose();
    }
  }, []);

  const handleOnClose = () => {
    setRoleInput('');
    onClose();
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleVerifyRole();
    }
  };

  const handleInputChange = (input: string) => {
    setRoleAvailable(true);
    setVerified(false);
    setRoleInput(input.replace(/[^A-Z0-9_\\.]/gi, ''));
  };

  const handleCreateRole = () => {
    isRoleAvailable(municipality.municipalityId, namespace.namespace, roleInput)
    .then((res) => {
      if (res) {
        setSaving(true);
        createRole(municipality.municipalityId, namespace.namespace, {
          name: roleInput.toUpperCase(),
          displayName: displayNameInput,
        })
        .then(() => {
          setSaving(false);
          handleOnClose();
        })
        .catch((e) => {
          handleError('Error when creating role:', e, t('common:errors.errorCreatingRole'));
        });
      }
    })
    .catch((e) => {
      handleError('Error when verifying role name availability:', e, t('common:errors.errorVerifyingRolename'));
    });
  };

  const handleUpdateRole = () => {
    isRoleAvailable(municipality.municipalityId, namespace.namespace, roleInput)
    .then((res) => {
      if (res || existingRole.name === roleInput) {
        setSaving(true);
        updateRole(municipality.municipalityId, namespace.namespace, currentRoleName, {
          name: roleInput.toUpperCase(),
          displayName: displayNameInput,
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
      handleError('Error when verifying role name availability:', e, t('common:errors.errorVerifyingRolename'));
    });
  };

  const handleVerifyRole = () => {
    if (existingRole && existingRole.name === roleInput) {
      setRoleAvailable(true);
      setVerified(true);
      return;
    }
	
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

  const confirmDelete = () => {
	setConfirmOpen(true);
  };

  const handleOnAbort = () => {
	setConfirmOpen(false);
  };
    
  const handleDeleteRole = () => {
	setConfirmOpen(false);
	
    deleteRole(municipality.municipalityId, namespace.namespace, currentRoleName)
    .then(() => {
      setSaving(false);
      handleOnClose();
    })
    .catch((e) => {
      handleError('Error when deleting role:', e, t('common:errors.errorDeletingRole'));
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
    if (existingRole != null && existingRole != undefined) {
      setCurrentRoleName(existingRole.name);
      setRoleInput(existingRole.name);
      setDisplayNameInput(existingRole.displayName);
    }
	
    setRoleAvailable(true);
    setVerified(false);
    setSaving(false);
  }, []);

  return (
    <Dialog
      show={open}
      label={existingRole ? `${t('common:dialogs.manage_role.header_prefix_modify')} ${namespace?.displayName} ${t('common:in')} ${municipality?.name}` : 
         `${t('common:dialogs.manage_role.header_prefix_create')} ${namespace?.displayName} ${t('common:in')} ${municipality?.name}`}
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
              {t('common:dialogs.manage_role.confirm_delete')}
            </div>
          </Dialog.Content>
          <Dialog.Buttons className={'container-right'}>
            <Button color={'vattjom'} onClick={() => handleDeleteRole()}>
              {t('common:buttons.confirm')}
            </Button>
            <Button variant={'tertiary'} color={'vattjom'} onClick={() => handleOnAbort()}>
              {t('common:buttons.abort')}
            </Button>
          </Dialog.Buttons>
        </Dialog>      

        <div>
          <p>{t('common:dialogs.manage_role.role_input_heading')}:</p>
          <div className="fill-available">
            <Input.Group invalid={roleInput.length === 0 || !roleAvailable ? true : undefined}>
              <Input.RightAddin icon className="fill-available">
                <Input
                  disabled={existingRole != null} // Existing role name can not be updated 
                  className={'upper-case'}
                  maxLength={250}
                  value={roleInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleEnter(e)}
                  onBlur={() => handleVerifyRole()}
                />
                <Icon name={roleAvailable ? undefined : 'shield-x'} color={'error'} />
              </Input.RightAddin>
            </Input.Group>
          </div>
        </div>
        <div className="bottom-margin-50">
          <p>{t('common:dialogs.manage_role.display_name_input_heading')}:</p>
          <div>
                <Input
                  disabled={existingRole != null} // Right now existing role can not be updated, only deleted 
                  className="fill-available"
                  placeholder={t('common:dialogs.manage_role.displayname_placeholder')}
                  maxLength={250}
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  onKeyDown={(e) => handleEnter(e)}
                />
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Buttons className={'container-right'}>
        <Button
          className={existingRole ? 'hidden' : ''} /* Update is hidden until patch is supported by backing api-service */
          disabled={roleInput.length === 0 || !roleAvailable}
          loading={saving}
          color={'vattjom'}
          onClick={() => existingRole ? handleUpdateRole() : handleCreateRole()}
        >
          {existingRole ? t('common:buttons.update') : t('common:buttons.create')}
        </Button>
        {existingRole &&
          <Button
            color={'juniskar'}
            onClick={() => confirmDelete()}
          >
            {t('common:buttons.delete')}
          </Button>
        }
        <Button variant={'tertiary'} color={'vattjom'} onClick={() => handleOnClose()}>
          {t('common:buttons.close')}
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};
