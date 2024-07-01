import { Button, Dialog, Link, Divider, useSnackbar } from '@sk-web-gui/react';
import {useState} from "react";
import { useTranslation } from 'next-i18next';

interface CreateNamespaceProps {
  open: boolean;
  municipalityId: string;
  onClose: (confirm: boolean) => void;
}

export const DialogCreateNamespace: React.FC<CreateNamespaceProps> = ({ open, municipalityId, onClose }) => {
  const { t } = useTranslation();
  const snackBar = useSnackbar();
  const handleOnClose = () => {
    onClose(true);
  };
  
  return (
    <Dialog show={open} className="md:min-w-[100rem]">
    {document &&
      <Dialog.Content>
        [Implement dialog for adding new namespace to municipality {municipalityId}]
      </Dialog.Content>}
      <Dialog.Buttons>
        <Button
          color={'vattjom'}
		  onClick={() => handleOnClose()}>
          {t('common:buttons.close')}
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};