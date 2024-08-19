import React, { useEffect, useState } from 'react';
import { Accordion, Card, MenuVertical, Icon, useSnackbar } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import { getLabels } from '@services/supportmanagement-service/supportmanagement-label-service';
import { Label } from '@data-contracts/backend/label-contracts';
import Button from '@sk-web-gui/button';
import { DialogCreateLabel } from '@components/dialogs/dialog_create_label';
import { MunicipalityInterface, NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { v4 } from 'uuid';
import { Input } from '@sk-web-gui/forms';
import { CreateLabelInterface } from '@interfaces/create_label';
import { CategoryInterface } from '@interfaces/supportmanagement.category';
import {
  getCategories,
} from '@services/supportmanagement-service/supportmanagement-category-service';
import { MenuIndex } from '@sk-web-gui/react/dist/types/menu-vertical/src/menu-vertical-context';

interface MainPageLabelsProps {
  title: string
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
}

export const MainPageLabelsContent: React.FC<MainPageLabelsProps> = ({title, municipality, namespace, }) => {
  const { t } = useTranslation();
  const snackBar = useSnackbar();
  const [labels, setLabels] = useState<Label[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [current, setCurrent] = React.useState<MenuIndex>();
  //Keep track of whether the create dialog is open or not
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  //Keep track of the selected municipality
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityInterface>(null);
  const [labelInterface, setLabelInterface] = useState<CreateLabelInterface>();
  const [redraw, setRedraw] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const handleRedraw = (uuid: string) => {
    setRedraw(uuid);
  };

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

  const getDisplayname = (category: string, name: string): string => {
    let matches = categories.filter((item) => item.name === name); // First try to find a match at category level

    if (matches.length === 0) { // If no match on name at category level, extract correct category and match name on type level
      matches = categories.filter((item) => item.name === category)
        .map((item) => item.types)
        .flat()
        .filter((item) => item.name === name);
    }

    return matches.length === 0 ? name : matches[0].displayName; // Return displayname if found, otherwise name
  };

  const openCreateDialogHandler = () => {
    setIsCreateDialogOpen(true);
  };

  const closeCreateDialogHandler = () => {
    setIsCreateDialogOpen(false);
  };

  /**
   * Fetch labels from backend and set them
   */
  useEffect(() => {
    // Load labels
    getLabels(municipality.municipalityId, namespace.namespace)
      .then((labels) => setLabels(labels.labelStructure))
      .catch((e) => handleError('Error when loading labels:', e, t('common:errors.errorLoadingLabels')));

    // Load categories (used for trying to get a displayName translation for categories and types)
    getCategories(municipality.municipalityId, namespace.namespace)
      .then((res) => setCategories(res))
      .catch((e) => handleError('Error when loading categories:', e, t('common:errors.errorLoadingCategories')));

  }, []);

  useEffect(() => {
    setLabelInterface({
      classification: '',
      name: '',
      displayname: '',
      isActualLabel: undefined,
      label: [],
      uuid: '',
    });
  }, []);

  const handleClassificationChange = (key: string, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const handleNameChage = (key: string, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const handleDisplayNameChange = (key: string, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const renderAccordion = (parentLabel: Label, label: Label) => {
    return (
      <Accordion>
        <Accordion.Item header={'Add stuff'}>
          <div>
            <div>
              {/*Input for display name, only to be active if the parent label is a "real" label*/}
              <span>{t('common:dialogs.manage_label.display_name_input_heading')}</span>
              <Input
                key={'displayname-' + `${label.uuid}`}
                value={inputValues['displayname-' + `${label.uuid}`] || ''}
                onChange={(e) => handleDisplayNameChange(`displayname-${label.uuid}`, e.target.value)}
              />
            </div>
            <div>
              {/*Input for name*/}
              <span>{t('common:dialogs.manage_label.name_input_heading')}</span>
              <Input
                key={'name-' + `${label.uuid}`}
                className={'upper-case'}
                value={inputValues['name-' + `${label.uuid}`] || ''}
                onChange={(e) => handleNameChage(`name-${label.uuid}`, e.target.value)}
              />
            </div>
            <div>
              {/*Input for classification*/}
              <span>{t('common:dialogs.manage_label.classification_input_heading')}</span>
              <Input
                key={'classification-' + `${label.uuid}`}
                className={'upper-case'}
                value={inputValues['classification-' + `${label.uuid}`] || ''}
                onChange={(e) => handleClassificationChange('classification-' + `${label.uuid}`, e.target.value)}
              />
            </div>
            <div>
              <Button
                leftIcon={<Icon name={'plus'} />}
                color={'vattjom'}
                onClick={() => {
                  console.log('Add label');
                  label.labels.push({
                    classification: inputValues['classification-' + `${label.uuid}`],
                    name: inputValues['name-' + `${label.uuid}`],
                    displayName: inputValues['displayname-' + `${label.uuid}`],
                    isActualLabel: label.isActualLabel,
                    uuid: v4(),
                  });
                  handleRedraw(parentLabel.uuid);
                }}
              >
                {t('common:buttons.add_label')}
              </Button>
            </div>
          </div>
        </Accordion.Item>
      </Accordion>
    );
  };

  /**
   * Recursively render labels and sublabels
   * @param parentLabel the parent label
   * @param label the label to render
   */
  const renderLabels = (parentLabel: Label, label: Label) => {
    //If we have a label with sublabels, render the SubmenuButtoon and the sublabels
    if (label && label.labels && label.labels.length > 0) {
      return (
        <MenuVertical.Item key={label.uuid} id={label.uuid}>
          <MenuVertical>
            <MenuVertical.SubmenuButton>
              <a href={`#${label.uuid}`}>{label.classification + ' - ' + label.name}</a>
            </MenuVertical.SubmenuButton>
            {label.labels.map(subLabel => renderLabels(label, subLabel))}
            <MenuVertical.Item>
              {renderAccordion(parentLabel, label)}
            </MenuVertical.Item>
          </MenuVertical>
        </MenuVertical.Item>
      );
    } else {
      return (
        <MenuVertical.Item key={label.uuid} id={label.uuid}>
          <div className={'label-info'}>
            {label.name && label.displayName && label.classification &&
              <div>
                <p>
                  <b>{`${label.displayName}`}</b>
                </p>
                <p>
                  <span>{`${t('common:subpages.labels.label.name')}: `}</span>
                  <b>{`${label.name}`}</b>
                </p>
                <p>
                  <span>{`${t('common:subpages.labels.label.classification')}: `}</span>
                  <b>{`${label.classification}`}</b>
                </p>
              </div>
            }
          </div>
        </MenuVertical.Item>
      );
    }
  };

  /**
   * Set the current label
   * @param menuIndex
   */
  const handleSetCurrent = (menuIndex: React.SetStateAction<MenuIndex>) => {
    setCurrent(menuIndex);
  };

  /**
   * Render the page
   */
  return (
    <>
      <DialogCreateLabel
        open={isCreateDialogOpen}
        municipality={selectedMunicipality}
        onClose={closeCreateDialogHandler}
        key={v4()}
      />
      { labels && labels.length > 0 ?
        <div>
          <MenuVertical.Provider current={current} setCurrent={handleSetCurrent}>
            <MenuVertical.Sidebar>
              <MenuVertical.Header>
                {t('common:submenu.labels')}
              </MenuVertical.Header>
              <MenuVertical>
                {labels.map(label => renderLabels(label, label))}
              </MenuVertical>
            </MenuVertical.Sidebar>
          </MenuVertical.Provider>

          <div className="mt-4">
            <Button
              leftIcon={<Icon name={'plus'} />}
              color={'vattjom'}
              onClick={() => {
                console.log('Add label');
                openCreateDialogHandler();
              }}
            >
              {t('common:buttons.add_label')}
            </Button>
          </div>
        </div>

      :
        //If no labels, show an error message
        (!labels || labels.length === 0) &&
        <Card color={'tertiary'}>
          <Card.Body>
            <Card.Text>
              <div className="capitalize-first">
                {t('common:subpages.labels.missing')}
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      }
    </>
  );
};
