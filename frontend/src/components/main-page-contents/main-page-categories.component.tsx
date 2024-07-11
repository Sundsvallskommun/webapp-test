import { Button, Card, useSnackbar, Icon, MenuVertical } from '@sk-web-gui/react';
import { useState, useEffect, SetStateAction } from 'react';
import { useTranslation } from 'next-i18next';
import { DialogCreateCategory } from '@components/dialogs/dialog_create_category';
import { DialogModifyCategory } from '@components/dialogs/dialog_modify_category';
import { getCategories } from '@services/supportmanagement-service/supportmanagement-categories-service';
import { MunicipalityInterface, NamespaceInterface, CategoryInterface } from '@interfaces/supportmanagement';
import { toReadableTimestamp } from '@utils/dateformat';

interface MainPageCategoriesProps {
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
}

export const MainPageCategoriesContent: React.FC<MainPageCategoriesProps> = ({ municipality, namespace }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const snackBar = useSnackbar();
  const [current, setCurrent] = useState<number>(1);
  const [isManageCategoryDialogOpen, setIsManageCategoryDialogOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryInterface | null>(null);
  
  const handleSetCurrent = (menuIndex: SetStateAction<number>) => {
    console.log('handleSetCurrent menuIndex', menuIndex);
    setCurrent(menuIndex);
  };
  
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

  const closeManageCategoryDialog = (reloadTable: boolean) => {
    if (reloadTable) {
      loadCategories();
    }
    setIsManageCategoryDialogOpen(false);
  };
  
  useEffect(() => {
    loadCategories();
  } ,[]);

  return (
  <>
    {selectedCategory ?
      <DialogModifyCategory
        open={isManageCategoryDialogOpen}
        municipality={municipality}
        namespace={namespace}
        category={selectedCategory}
        onClose={closeManageCategoryDialog}/>  
    
    :
      <DialogCreateCategory
        open={isManageCategoryDialogOpen}
        municipality={municipality}
        namespace={namespace}
        onClose={closeManageCategoryDialog}/>  
    }

    {categories && categories.length > 0 ?
      <>
        <MenuVertical.Provider current={current} setCurrent={handleSetCurrent}>
          <MenuVertical.Sidebar>
            <MenuVertical.Header>
              {t('common:subpages.categories.menuheader')}
            </MenuVertical.Header>
            <MenuVertical  id="sk-main-page-menu">

              {categories.map(category =>
                <MenuVertical.Item key={category.name} id={category.name}>
                  <MenuVertical>
                    <MenuVertical.SubmenuButton>

                      <a href={`#${category.name}`}>
                        <Icon 
                          name={'list-tree'}
                        />
                      
                        <p>{category.displayName}</p>
                      
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
                      </a>
                    </MenuVertical.SubmenuButton>
                  
                    <MenuVertical.Item key={category.name + '_created'}>
                      <div className="submenu-info">
                        <p>{`${t('common:subpages.categories.category_name')}: ${category.name}`}</p>
                        <p>{category.created && `${t('common:subpages.categories.created')}: ${toReadableTimestamp(category.created)}`}</p>
                        <p>{category.modified && `${t('common:subpages.categories.modified')}: ${toReadableTimestamp(category.modified)}`}</p>
                      </div>
                    </MenuVertical.Item>
                  
                    {category.types.map(type => 
                      <MenuVertical.Item key={category.name + type.name} id={category.name + type.name}>
                        <div className="menuitem-div">
                          <b>{`${type.displayName}`}</b>
                          <div className="submenu-info">
                            <p>{`${t('common:subpages.categories.category_type_name')}: ${type.name}`}</p>
                            <p>{type.escalationEmail && `${t('common:subpages.categories.escalation_mail')}: ${type.escalationEmail.toLowerCase()}`}</p>
                            <p>{type.created && `${t('common:subpages.categories.created')}: ${toReadableTimestamp(type.created)}`}</p>
                            <p>{type.modified && `${t('common:subpages.categories.modified')}: ${toReadableTimestamp(type.modified)}`}</p>
                          </div>
                        </div>
                      </MenuVertical.Item>
                    )}
                  
                  </MenuVertical>
                </MenuVertical.Item>
              )}
              
            </MenuVertical>
          </MenuVertical.Sidebar>
        </MenuVertical.Provider>

        <Button
          color={'vattjom'}
          onClick={() => openManageCategoryDialog(null)}>
          {t('common:buttons.add_category')}
        </Button>
      </>
    :
      <Card color={'tertiary'}>
        <Card.Body>
          <Card.Text>
            <div className="capitalize-first">
              {t('common:subpages.categories.missing')}
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    }

  </>
  );
};
