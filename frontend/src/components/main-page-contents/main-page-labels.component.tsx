import React, { useEffect, useState } from 'react';
import { Button, Card, MenuVertical, MenuVerticalProps, useSnackbar } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useTranslation } from 'next-i18next';
import { getLabels } from '@services/supportmanagement-service/supportmanagement-label-service';
import { LabelInterface } from '@interfaces/supportmanagement.label';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { DialogManageLabel } from '@components/dialogs/dialog_manage_label';
import { v4 } from 'uuid';

interface MainPageLabelsProps {
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
}

export const MainPageLabelsContent: React.FC<MainPageLabelsProps> = ({ municipality, namespace }) => {
  const { t } = useTranslation();
  const snackBar = useSnackbar();
  const [labels, setLabels] = useState<LabelInterface[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<LabelInterface | null>(null);
  const [isManageLabelDialogOpen, setIsManageLabelDialogOpen] = useState<boolean>(false);
  const [current, setCurrent] =
    React.useState<React.ComponentPropsWithoutRef<MenuVerticalProps['Item']>['menuIndex']>();

  /**
   * Display an error message in the snackbar
   * @param errorDescription the description of the error to be printed to console
   * @param e the Error object
   * @param message the message to display in the snackbar
   */
  const handleError = (errorDescription: string, e: Error, message: string) => {
    console.error(errorDescription, e);
    snackBar({
      message: message,
      status: 'error',
      position: 'top',
      closeable: false,
    });
  };

  const openManageLabelDialog = (label: LabelInterface | null) => {
    setSelectedLabel(label);
    setIsManageLabelDialogOpen(true);
  };

  const closeManageLabelDialog = () => {
    setIsManageLabelDialogOpen(false);
  };

  useEffect(() => {
    if (!isManageLabelDialogOpen) {
      loadLabels();
    }
  }, [isManageLabelDialogOpen]);

  /**
   * Fetch labels from backend and set them
   */
  const loadLabels = () => {
    if (municipality && namespace) {
      getLabels(municipality.municipalityId, namespace.namespace)
        .then((labels) => setLabels(labels))
        .catch((error) => handleError(`{${t('common:errors.errorLoadingLabels')}`, error, error.message));
    }
  };

  /**
   * Recursively render labels and sublabels
   * @param label the label to render
   */
  const renderLabels = (label: LabelInterface) => {
    // If the label is leaf return a simple MenuVertical.Item
    if (label.isLeaf) {
      return (
        <MenuVertical.Item key={label.uuid} id={label.uuid}>
          {label.name && label.classification && (
            <div className="menuitem-div">
              <p>
                <b>{`${label.displayName}`}</b>
                <Button
                  className={'edit-subitem'}
                  variant={'link'}
                  size={'sm'}
                  onClick={() => openManageLabelDialog(label)}
                >
                  <LucideIcon color={'vattjom'} name={'folder-pen'} size={16} />
                </Button>
              </p>
              <div className={'label-info'}>
                <p>
                  <span>{`${t('common:subpages.labels.label.name')}: `}</span>
                  <b>{`${label.prefix || ''}`}{label.prefix && '.'}{`${label.name}`}</b>
                </p>
                <p>
                  <span>{`${t('common:subpages.labels.label.classification')}: `}</span>
                  <b>{`${label.classification}`}</b>
                </p>
              </div>
            </div>
          )}
        </MenuVertical.Item>
      );
    }
    
    // If the label has sublabels, create a submenu
    return (
      <MenuVertical.Item key={label.uuid} id={label.uuid}>
        <MenuVertical>
          <MenuVertical.SubmenuButton className="main-content-menu-vertical">
            <div>
              <LucideIcon name={'list-tree'} />
              <span>
                {label.displayName}
              </span>
              <Button
                className={'edit-item'}
                variant={'link'}
                onClick={() => openManageLabelDialog(label)}
              >
                <LucideIcon color={'vattjom'} name={'folder-pen'} size={18} />
              </Button>
            </div>
          </MenuVertical.SubmenuButton>
          <MenuVertical.Item key={label.uuid + '_info'}>
            <div className="submenu-info">
              <p>
                <span>{`${t('common:subpages.labels.label.name')}: `}</span>
                 <b>{`${label.prefix || ''}`}{label.prefix && '.'}{`${label.name}`}</b>
              </p>
              <p>
                <span>{`${t('common:subpages.labels.label.classification')}: `}</span>
                <b>{`${label.classification}`}</b>
              </p>
            </div>
          </MenuVertical.Item>
          {label.labels?.map((child) => renderLabels(child))}
        </MenuVertical>
      </MenuVertical.Item>
    );
  };

  /**
   * Render the page
   */
  return (
    <>
      <DialogManageLabel
        key={v4()}
        open={isManageLabelDialogOpen}
        municipality={municipality}
        namespace={namespace}
        existingLabel={selectedLabel}
        existingLabelStructure={labels}
        onClose={closeManageLabelDialog}/>  

      {
        labels && labels.length > 0 ?
          <div>
            <MenuVertical.Provider current={current} setCurrent={setCurrent}>
              <MenuVertical.Sidebar>
                <MenuVertical.Header>{t('common:submenu.labels')}</MenuVertical.Header>
                <MenuVertical id="sk-main-page-menu">{labels.map((label) => renderLabels(label))}</MenuVertical>
              </MenuVertical.Sidebar>
            </MenuVertical.Provider>
          </div>
          //If no labels, show an error message
        : <Card color={'tertiary'}>
            <Card.Body>
              <Card.Text>
                <div className="capitalize-first">{t('common:subpages.labels.missing')}</div>
              </Card.Text>
            </Card.Body>
          </Card>

      }

      <Button 
        leftIcon={<LucideIcon name={'square-plus'} />} 
        color={'vattjom'} 
        onClick={() => openManageLabelDialog(null)}>
        {t('common:buttons.add_label')}
      </Button>

    </>
  );
};
