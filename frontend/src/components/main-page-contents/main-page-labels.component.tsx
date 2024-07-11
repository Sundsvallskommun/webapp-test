import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { getLabels } from '@services/supportmanagement-service/supportmanagement-label-service';
import { Label } from '@data-contracts/backend/label-contracts';
import { Card, MenuVertical, useSnackbar } from '@sk-web-gui/react';
import { MenuIndex } from '@sk-web-gui/react/dist/types/menu-vertical/src/menu-vertical-context';

interface MainPageLabelsProps {
  title: string;
  municipalityId: string;
  namespace: string;
}

export const MainPageLabelsContent: React.FC<MainPageLabelsProps> = ({ title, municipalityId, namespace, }) => {
  const { t } = useTranslation();
  const snackBar = useSnackbar();
  const [labels, setLabels] = useState<Label[]>([]);
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

  /**
   * Fetch labels from backend and set them
   */
  useEffect(() => {
    getLabels(municipalityId, namespace)
      .then((labels) => {
        setLabels(labels.labelStructure);
      })
      .catch((error) => {
        handleError(`{${t('common:errors.errorLoadingRoles')}`, error, error.message);
      });
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

    // If the label has sublabels, create a submenu
    return (
      <MenuVertical.Item key={label.uuid} id={label.uuid}>
        <MenuVertical>
          <MenuVertical.SubmenuButton>
            <a href={`#${label.uuid}`}>{label.classification + ' - ' + label.name}</a>
          </MenuVertical.SubmenuButton>
          {label.labels.map(subLabel => renderLabels(subLabel))}
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
      {labels && labels.length > 0 ?
        <div className="w-[70rem]">
          <MenuVertical.Provider current={current} setCurrent={handleSetCurrent}>
            <MenuVertical.Sidebar>
              <MenuVertical.Header>
                <h4>{t('common:submenu.labels')}</h4>
              </MenuVertical.Header>
              <MenuVertical>
                {labels.map(label => renderLabels(label))}
              </MenuVertical>
            </MenuVertical.Sidebar>
          </MenuVertical.Provider>
        </div> :

        //If no labels, show an error message
        labels.length === 0 &&
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
