import React, { useEffect, useState } from 'react';
import { Card, MenuVertical, useSnackbar } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import { getLabels } from '@services/supportmanagement-service/supportmanagement-label-service';
import { Label } from '@data-contracts/backend/label-contracts';
import { MunicipalityInterface, NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { CategoryInterface } from '@interfaces/supportmanagement.category';
import {
  getCategories,
} from '@services/supportmanagement-service/supportmanagement-category-service';
import { MenuIndex } from '@sk-web-gui/react/dist/types/menu-vertical/src/menu-vertical-context';
import Icon from '@sk-web-gui/icon';

interface MainPageLabelsProps {
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
}

export const MainPageLabelsContent: React.FC<MainPageLabelsProps> = ({municipality, namespace}) => {
  const { t } = useTranslation();
  const snackBar = useSnackbar();
  const [labels, setLabels] = useState<Label[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [current, setCurrent] = React.useState<MenuIndex>();

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

  //TODO For some reason sub-labels aren't getting their display-names (Created UF-9599 for this).
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

  /**
   * Fetch labels from backend and set them
   */
  useEffect(() => {
    // Load labels
    getLabels(municipality.municipalityId, namespace.namespace)
      .then((labels) => setLabels(labels.labelStructure))
      .catch((error) =>  handleError(`{${t('common:errors.errorLoadingRoles')}`, error, error.message));

    // Load categories (used for trying to get a displayName translation for categories and types)
    getCategories(municipality.municipalityId, namespace.namespace)
      .then((res) => setCategories(res))
      .catch((e) => handleError('Error when loading categories:', e, t('common:errors.errorLoadingCategories')));

  }, []);

  /**
   * Recursively render labels and sublabels
   * @param label the label to render
   * @param category
   */
  const renderLabels = (label: Label, category: string) => {
    // If the label doesn't have sublabels, return a simple MenuVertical.Item
    if (!label.labels || label.labels.length === 0) {
      return (
        <MenuVertical.Item key={label.uuid} id={label.uuid}>
          {label.name && label.displayName && label.classification &&
            <div className="menuitem-div">
              <p>
                <b>{`${label.displayName}`}</b>
              </p>
              <div className={'label-info'}>
                <div>
                  <p>
                    <span>{`${t('common:subpages.labels.label.name')}: `}</span>
                    <b>{`${label.name}`}</b>
                  </p>
                  <p>
                    <span>{`${t('common:subpages.labels.label.classification')}: `}</span>
                    <b>{`${label.classification}`}</b>
                  </p>
                </div>
              </div>
            </div>
          }
        </MenuVertical.Item>
      );
    }

    // If the label has sublabels, create a submenu
    return (
      <MenuVertical.Item key={label.uuid} id={label.uuid}>
        <MenuVertical>
          <MenuVertical.SubmenuButton className="main-content-menu-vertical">
            <div>
              <Icon
                name={'list-tree'}
              />
              <b>{getDisplayname(label.classification, label.name)}</b><span className="classification">{`(${label.classification?.toLowerCase()})`}</span>
            </div>
          </MenuVertical.SubmenuButton>
          {label.labels.map(subLabel => renderLabels(subLabel, category))}
        </MenuVertical>
      </MenuVertical.Item>
    );
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
      { labels && labels.length > 0 ?
        <div>
          <MenuVertical.Provider current={current} setCurrent={handleSetCurrent}>
            <MenuVertical.Sidebar>
              <MenuVertical.Header>
                {t('common:submenu.labels')}
              </MenuVertical.Header>
              <MenuVertical id="sk-main-page-menu">
                {labels.map(label => renderLabels(label, label.classification))}
              </MenuVertical>
            </MenuVertical.Sidebar>
          </MenuVertical.Provider>
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
