import { Button, Dialog, Input, useSnackbar, Icon } from '@sk-web-gui/react';
import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
import { isRoleAvailable, createRole } from '@services/supportmanagement-service/supportmanagement-roles-service';
import { MunicipalityInterface, NamespaceInterface, CategoryInterface } from '@interfaces/supportmanagement';

interface ModifyCategoryProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  category: CategoryInterface|null;
  onClose: (reloadPage: boolean) => void;
}

export const DialogModifyCategory: React.FC<ModifyCategoryProps> = ({ open, municipality, namespace, category, onClose }) => {
  const { t } = useTranslation();
  const [saving, setSaving] = useState<boolean>(false);
  const snackBar = useSnackbar();
    
  const handleOnClose = (reloadPage: boolean) => {
    onClose(reloadPage);
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
	console.log(category);
  }, []);

  return (
    <Dialog
      show={open} 
      label={`${t('common:dialogs.manage_category.modify_header_prefix')} ${category.displayName} ${t('common:for')} ${t('common:domain')} ${namespace.displayname} ${t('common:in')} ${municipality.name}`}
      className="md:min-w-[100rem] dialog"
    >
      <Dialog.Content>


      </Dialog.Content>
      <Dialog.Buttons
        className={'container-right'}
      >

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