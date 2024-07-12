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
                        <p>
                          <span>{`${t('common:subpages.categories.category_name')}:`}</span>
                          <b>{`${category.name}`}</b>
                        </p>
                        <p>
                          {category.created &&
                          <>
                            <span>{`${t('common:subpages.categories.created')}:`}</span>
                            <b>{`${toReadableTimestamp(category.created)}`}</b>
                          </>
                        }
                        </p>
                        <p>
                          {category.modified &&
                          <>
                            <span>{`${t('common:subpages.categories.modified')}:`}</span>
                            <b>{`${toReadableTimestamp(category.modified)}`}</b>
                          </>
                          }
                        </p>
                      </div>
                    </MenuVertical.Item>
                  
                    {category.types.map(type => 
                      <MenuVertical.Item key={category.name + type.name} id={category.name + type.name}>
                        <div className="menuitem-div">
                          <b>{`${type.displayName}`}</b>
                          <div className="submenu-info">
                          
                            <p>
                              <span>{`${t('common:subpages.categories.category_type_name')}:`}</span>
                              <b>{`${type.name}`}</b>
                            </p>
                            <p>
                              {type.escalationEmail &&
                              <>
                                <span>{`${t('common:subpages.categories.escalation_mail')}:`}</span>
                                <b>{`${type.escalationEmail.toLowerCase()}`}</b>
                              </>
                            }
                            </p>
                            <p>
                              {type.created &&
                              <>
                                <span>{`${t('common:subpages.categories.created')}:`}</span>
                                <b>{`${toReadableTimestamp(type.created)}`}</b>
                              </>
                            }
                            </p>
                            <p>
                              {type.modified &&
                              <>
                                <span>{`${t('common:subpages.categories.modified')}:`}</span>
                                <b>{`${toReadableTimestamp(type.modified)}`}</b>
                              </>
                              }
                            </p>
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
