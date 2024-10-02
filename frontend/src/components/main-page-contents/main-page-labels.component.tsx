import React, { useEffect, useState } from 'react';
import { Card, MenuVertical, MenuVerticalProps, useSnackbar } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import { getLabels } from '@services/supportmanagement-service/supportmanagement-label-service';
import { Label } from '@data-contracts/backend/label-contracts';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import Icon from '@sk-web-gui/icon';

interface MainPageLabelsProps {
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
}

export const MainPageLabelsContent: React.FC<MainPageLabelsProps> = ({ municipality, namespace }) => {
  const { t } = useTranslation();
  const snackBar = useSnackbar();
  const [labels, setLabels] = useState<Label[]>([]);
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

  /**
   * Fetch labels from backend and set them
   */
  useEffect(() => {
    // Load labels
    getLabels(municipality.municipalityId, namespace.namespace)
      .then((labels) => setLabels(labels.labelStructure))
      .catch((error) => handleError(`{${t('common:errors.errorLoadingLabels')}`, error, error.message));
  }, []);

  /**
   * Recursively render labels and sublabels
   * @param label the label to render
   */
  const renderLabels = (label: Label) => {
    // If the label doesn't have sublabels, return a simple MenuVertical.Item
    if (!label.labels || label.labels.length === 0) {
      return (
        <MenuVertical.Item key={label.uuid} id={label.uuid}>
          {label.name && label.classification && (
            <div className="menuitem-div">
              <p>
                <b>{`${label.displayName}`}</b>
              </p>
              <div className={'label-info'}>
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
              <Icon name={'list-tree'} />
              <span>{label.displayName}</span>
              <span className="classification">{`(${label.classification?.toLowerCase()})`}</span>
            </div>
          </MenuVertical.SubmenuButton>
          {label.labels.map((subLabel) => renderLabels(subLabel))}
        </MenuVertical>
      </MenuVertical.Item>
    );
  };

  /**
   * Render the page
   */
  return (
    <>
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
    </>
  );
};
