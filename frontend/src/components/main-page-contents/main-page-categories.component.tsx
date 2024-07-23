import { Button, Card, useSnackbar, Icon, MenuVertical } from '@sk-web-gui/react';
import { useState, useEffect, SetStateAction } from 'react';
import { useTranslation } from 'next-i18next';
import { DialogCreateCategory } from '@components/dialogs/dialog_create_category';
import { DialogModifyCategory } from '@components/dialogs/dialog_modify_category';
import { MunicipalityInterface, NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { CategoryInterface } from '@interfaces/supportmanagement.category';
import { getCategories } from '@services/supportmanagement-service/supportmanagement-category-service';
import { toReadableTimestamp } from '@utils/dateformat';
import { MenuIndex } from '@sk-web-gui/react/dist/types/menu-vertical/src/menu-vertical-context';
import { v4 } from 'uuid';

interface MainPageCategoriesProps {
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
}

export const MainPageCategoriesContent: React.FC<MainPageCategoriesProps> = ({ municipality, namespace }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const snackBar = useSnackbar();
  const [isManageCategoryDialogOpen, setIsManageCategoryDialogOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryInterface | null>(null);
  
  const handleError = (errorDescription: string, e: Error, message: string) => {
    console.error(errorDescription, e);
    snackBar({
      message: message,
      status: 'error',
      position: 'top',
      closeable: false
    });
  };
  
  const loadCategories = () => {
    if (municipality && namespace) {
      getCategories(municipality.municipalityId, namespace.namespace)
        .then((res) => setCategories(res))
        .catch((e) => {
          handleError('Error when loading categories:', e, t('common:errors.errorLoadingCategories'));
        });
    }
  };

  const openManageCategoryDialog = (category: CategoryInterface | null) => {
    setSelectedCategory(category);
    setIsManageCategoryDialogOpen(true);
  };

  const closeManageCategoryDialog = () => {
    setIsManageCategoryDialogOpen(false);
  };
  
  useEffect(() => {
    if (!isManageCategoryDialogOpen) {
      loadCategories();
    }
  } ,[isManageCategoryDialogOpen]);

  return (
  <>
    {selectedCategory ?
      <DialogModifyCategory
        key={v4()} 
        open={isManageCategoryDialogOpen}
        municipality={municipality}
        namespace={namespace}
        category={selectedCategory}
        onClose={closeManageCategoryDialog}/>  

    :
      <DialogCreateCategory
        key={v4()} 
        open={isManageCategoryDialogOpen}
        municipality={municipality}
        namespace={namespace}
        onClose={closeManageCategoryDialog}/>  
    }

    {categories && categories.length > 0 ?
    <MenuVertical.Sidebar>
      <MenuVertical.Header>
        {t('common:subpages.categories.menuheader')}
      </MenuVertical.Header>
      <MenuVertical id="sk-main-page-menu">

        {categories.map(category =>
        <MenuVertical.Item key={category.name} id={category.name}>
          <MenuVertical>
            <MenuVertical.SubmenuButton className='main-content-menu-vertical'>

              <div>
                <Icon 
                  name={'list-tree'}
                />

                <span>{category.displayName}</span>

                <Button
                  className={'edit-item'}
                  variant={'link'}
                  color={'vattjom'}
                  onClick={() => openManageCategoryDialog(category)}
                >
                  <Icon 
                    name={'wrench'}
                    size={20}
                  />
                </Button>
              </div>
            </MenuVertical.SubmenuButton>

            <MenuVertical.Item key={category.name + '_created'}>
              <div className="submenu-info">
                <p>
                  <span>{`${t('common:subpages.categories.category_name')}: `}</span>
                  <b>{`${category.name}`}</b>
                </p>
                <p>
                  {category.created &&
                  <>
                    <span>{`${t('common:subpages.categories.created')}: `}</span>
                    <b>{`${toReadableTimestamp(category.created)}`}</b>
                  </>}
                </p>
                <p>
                  {category.modified &&
                  <>
                    <span>{`${t('common:subpages.categories.modified')}: `}</span>
                    <b>{`${toReadableTimestamp(category.modified)}`}</b>
                  </>}
                </p>
              </div>
            </MenuVertical.Item>

            {category.types.map(type => 
            <MenuVertical.Item key={category.name + type.name} id={category.name + type.name}>
              <div className="menuitem-div">
                <b>{`${type.displayName}`}</b>
                <div className="submenu-info">

                  <p>
                    <span>{`${t('common:subpages.categories.category_type_name')}: `}</span>
                    <b>{`${type.name}`}</b>
                  </p>
                  <p>
                    {type.escalationEmail &&
                    <>
                      <span>{`${t('common:subpages.categories.escalation_mail')}: `}</span>
                      <b>{`${type.escalationEmail.toLowerCase()}`}</b>
                    </>}
                  </p>
                  <p>
                    {type.created &&
                    <>
                      <span>{`${t('common:subpages.categories.created')}: `}</span>
                      <b>{`${toReadableTimestamp(type.created)}`}</b>
                    </>}
                  </p>
                  <p>
                    {type.modified &&
                    <>
                      <span>{`${t('common:subpages.categories.modified')}: `}</span>
                      <b>{`${toReadableTimestamp(type.modified)}`}</b>
                    </>}
                  </p>
                </div>
              </div>
            </MenuVertical.Item>)}
                  
          </MenuVertical>
        </MenuVertical.Item>)}
      </MenuVertical>
    </MenuVertical.Sidebar>
    :
    <Card color={'tertiary'}>
      <Card.Body>
        <Card.Text>
          <div className="capitalize-first">
            {t('common:subpages.categories.missing')}
          </div>
        </Card.Text>
      </Card.Body>
    </Card>}

    <Button
      color={'vattjom'}
      onClick={() => openManageCategoryDialog(null)}>
      {t('common:buttons.add_category')}
    </Button>
  </>
  );
};
