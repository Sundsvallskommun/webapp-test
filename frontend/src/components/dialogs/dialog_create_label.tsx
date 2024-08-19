import { MunicipalityInterface } from '@interfaces/supportmanagement';
import { Dialog } from '@sk-web-gui/modal';
import React, { useEffect, useState } from 'react';
import Button from '@sk-web-gui/button';
import { useTranslation } from 'next-i18next';
import { Input } from '@sk-web-gui/forms';
import { CreateLabelInterface } from '@interfaces/create_label';
import Icon from '@sk-web-gui/icon';

interface CreateLabelProps {
  open: boolean;
  municipality: MunicipalityInterface;
  onClose: (confirm: boolean) => void;
}

export const DialogCreateLabel: React.FC<CreateLabelProps> = ({ open, municipality, onClose }) => {
  const { t } = useTranslation();
  const [labelInterface, setLabelInterface] = useState<CreateLabelInterface>();

  useEffect(() => {
    setLabelInterface({
      classification: '',
      name: '',
      displayname: '',
      label: [],
    });
    if (open) {
    }
  }, []);

  const handleOnClose = (reloadDomainNameDropdown: boolean) => {
    onClose(false);
  };

  const handleClassigicationChange = (value: string) => {
    setLabelInterface({ ...labelInterface, classification: value });
  };

  return (
    <Dialog
      show={open}
      label={t('common:dialogs.manage_label.header_prefix')}
      className="md:min-w-[60rem] dialog"
    >
      <Dialog.Content>
        <div className={'d-flex'}>
          <div>
            {/*Input for classification*/}
            <p>{t('common:dialogs.manage_label.classification_input_heading')}:</p>
            <Input
              className={'upper-case'}
              value={labelInterface?.classification}
              onChange={(e) => handleClassigicationChange(e.target.value)}
            />
          </div>
          <div>
            {/*Input for name*/}
            <p>{t('common:dialogs.manage_label.name_input_heading')}:</p>
            <Input
              className={'upper-case'}
              value={labelInterface?.name}
            />
          </div>
        </div>
      </Dialog.Content>
      {/*Buttons*/}
      <div>
        <Dialog.Buttons className={'container-right'}>
          <Button
            variant={'primary'}
            color={'vattjom'}
            onClick={() => handleOnClose(true)} // TODO for now
          >
            {t('common:buttons.create')}
          </Button>
          <Button
            variant={'tertiary'}
            color={'vattjom'}
            onClick={() => handleOnClose(false)}
          >
            {t('common:buttons.close')}
          </Button>
        </Dialog.Buttons>
      </div>
    </Dialog>
  );
};
