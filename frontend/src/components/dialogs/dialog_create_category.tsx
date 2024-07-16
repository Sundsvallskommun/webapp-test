import { Button, Dialog, Input, useSnackbar, Icon, Table } from '@sk-web-gui/react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { MunicipalityInterface, NamespaceInterface } from '@interfaces/supportmanagement';
import { CategoryRequestInterface } from '@interfaces/supportmanagement.category';
import { isCategoryAvailable, createCategory } from '@services/supportmanagement-service/supportmanagement-category-service';

interface CreateCategoryProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  onClose: () => void;
}

export const DialogCreateCategory: React.FC<CreateCategoryProps> = ({ open, municipality, namespace, onClose }) => {
  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const snackBar = useSnackbar();
  const [categoryAvailable, setCategoryAvailable] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryRequestInterface>();
  const [saving, setSaving] = useState<boolean>(false);
  const { t } = useTranslation();
  
  const handleError = (errorDescription: string, e: Error, message: string) => {
    console.error(errorDescription, e);
    displayMessage(message, 'error');
  };

  const displayMessage = (message: string, messageType: string) => {
    snackBar({
      message: message,
      status: messageType,
      className: 'middle',
      position: 'top',
      closeable: false
    });
  };
  
  const handleVerifyCategoryName = () => {
	if (category.name.length === 0) {
		return;
	}
	
    isCategoryAvailable(municipality.municipalityId, namespace.namespace, category.name)
      .then((res) => setCategoryAvailable(res))
      .then(() => setVerified(true))
      .catch((e) => {
        handleError('Error when verifying category availability:', e, t('common:errors.errorVerifyingCategory'));
      });
  };

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerifyCategoryName();
    }
  };
  
  const handleNameInputChange = (input: string) => {
    const validatedInput = input.replace(/[^A-Z0-9_]/ig, "");

    setCategoryAvailable(true);
    setVerified(false);
    setCategory({...category,
      name: validatedInput.toUpperCase()
    });
  };
  
  const handleDisplayNameInputChange = (input: string) => {
    setCategory({...category,
      displayName: input});
  };
  
  const handleAddCategoryType = () => {
	setCategory({...category,
	  types: [...category.types, {
		name: '',
		displayName: '',
		escalationEmail: ''
	  }]
	})
  };

  const handleTypeNameInputChange = (idx: number, input: string) => {
    const validatedInput = input.replace(/[^A-Z0-9_]/ig, "");
	const future = {...category};
	future.types[idx].name = validatedInput.toUpperCase();
	setCategory(future);
  };
  
  const handleTypeDisplayNameInputChange = (idx: number, input: string) => {
	const future = {...category};
	future.types[idx].displayName = input;
	setCategory(future);
  };

  const handleTypeEscalationEmailInputChange = (idx: number, input: string) => {
	const future = {...category};
	future.types[idx].escalationEmail = input.toLowerCase();
	setCategory(future);
  }
  
  const handleTypeRemoval = (idx: number) => {
	const future = {...category};
    future.types.splice(idx, 1);
  	setCategory(future);
  }

  const handleCreateCategory = () => {
    setSaving(true);
    createCategory(municipality.municipalityId, namespace.namespace, category)
      .then(() => onClose())
      .catch((e) => {
        handleError('Error when saving category:', e, t('common:errors.errorCreatingCategory'));
      })
      .finally(() => setSaving(false));
  };
  
  const validEmail = (email: string) => {
    return email.length === 0 || RegExp(emailRegex).exec(email);
  };
  
  const uniqueNames = ():boolean => {
    // Validate that name and displayName is only present once in type-list
    let allValid = true;
    
    category.types.map(m => {
      if (category.types.filter((d) => d.name === m.name).length > 1) {
        allValid = false;
      }
      if (category.types.filter((d) => d.displayName === m.displayName).length > 1) {
        allValid = false;
      }
    });
    
    return allValid;
  };

  const validTypes = ():boolean => {
    let allValid = true;
    category.types.map(m => {
      if (m.name.length == 0 || m.displayName.length == 0 || !validEmail(m.escalationEmail)) {
        allValid = false;
      }
    });

    return allValid && uniqueNames();
  };

  useEffect(() => {
	setCategory({
      name: '',
      displayName: '',
      types: []
    });
  }, []);

  return (
    <Dialog
      show={open} 
      label={`${t('common:dialogs.manage_category.create_header_prefix')} ${namespace.displayname} ${t('common:in')} ${municipality.name}`}
      className="md:min-w-[100rem] dialog"
    >
      <Dialog.Content>
        <div className="d-flex">
          <div>
            <p>{t('common:dialogs.manage_category.category_name_input_heading')}:</p>
         </div>
          <div>
            <Input.Group
              invalid={category?.name.length === 0 || !categoryAvailable ? 'true' : undefined} 
            >
              <Input.RightAddin icon>
                <Input 
                  className={'upper-case'}
                  maxLength={18}
                  value={category?.name}
                  onChange={(e) => handleNameInputChange(e.target.value)}
                  onKeyDown={(e) => handleEnter(e)}
                  onBlur={() => handleVerifyCategoryName()}
                />

                <Icon 
                  name={!verified || categoryAvailable ? '' : 'shield-x'}
                  color={'error'}
                />
              </Input.RightAddin>
            </Input.Group>
           </div>

          <div>
            <p>{t('common:dialogs.manage_category.category_display_name_input_heading')}:</p>
          </div>
          <div className="d-flex">
            <Input 
              id={'category-displayname'}
              maxLength={250}
              placeholder={t('common:dialogs.manage_category.displayname_placeholder')}
              invalid={category?.displayName.length === 0 ? 'true' : undefined} 
              value={category?.displayName}
              onChange={(e) => handleDisplayNameInputChange(e.target.value)}
            />
           </div>
         </div>
         
         {category?.types.length > 0 &&
         <Table className={'top-margin-50'} background={false} scrollable>
           <Table.Header>
             <Table.HeaderColumn 
               key={'header_name'}>
                 {t('common:dialogs.manage_category.categorytype_name_input_heading')}
             </Table.HeaderColumn>)
             <Table.HeaderColumn 
               key={'header_display_name'}>
                 {t('common:dialogs.manage_category.categorytype_display_name_input_heading')}
             </Table.HeaderColumn>)
             <Table.HeaderColumn 
               key={'header_escalation_email'}>
                 {t('common:dialogs.manage_category.categorytype_escalation_email_input_heading')}
             </Table.HeaderColumn>)
           </Table.Header>
           <Table.Body>
             {category?.types.map((m, idx) => <Table.Row key={'type_input' + idx}>
               <Table.Column>
                 <Input 
                   placeholder={t('common:dialogs.manage_category.type_name_placeholder')}
                   invalid={m.name.length === 0 || !uniqueNames() ? 'true' : undefined} 
                   value={m.name}
                   onChange={(e) => handleTypeNameInputChange(idx, e.target.value)}
                 />
               </Table.Column>
               <Table.Column>
                 <Input 
                   placeholder={t('common:dialogs.manage_category.displayname_placeholder')}
                   invalid={m.displayName.length === 0 || !uniqueNames() ? 'true' : undefined} 
                   value={m.displayName}
                   onChange={(e) => handleTypeDisplayNameInputChange(idx, e.target.value)}
                 />
               </Table.Column>
               <Table.Column>

                 <Input.Group invalid={!validEmail(m.escalationEmail) ? 'true' : undefined} >
                   <Input.RightAddin icon>

                     <Input 
                       className={'email'}
                       placeholder={t('common:dialogs.manage_category.escalation_email_placeholder')}
                       value={m.escalationEmail}
                       onChange={(e) => handleTypeEscalationEmailInputChange(idx, e.target.value)}
                     />

                    <Icon 
                      name={validEmail(m.escalationEmail) ? '' : 'shield-x'}
                      color={'error'}
                    />
                  </Input.RightAddin>
                </Input.Group>
               
                 <Button 
                   className={'delete-button'} 
                   color={'vattjom'}
                   variant={'link'}
                   iconButton 
                   onClick={() => handleTypeRemoval(idx)}>
                   <Icon name={'trash-2'} />
                 </Button>
               </Table.Column>
             </Table.Row>)}
           </Table.Body>
         </Table>}
        
      </Dialog.Content>
      <br/>
      <Dialog.Buttons
        className={'container-right'}
      >
        <Button
          disabled={saving}
          color={'vattjom'}
          onClick={() => handleAddCategoryType()}>
          {t('common:dialogs.manage_category.add_categorytype')}
        </Button>

        <Button
          loading={saving}
          disabled={!(verified && categoryAvailable && category?.name.length > 0 && category?.displayName.length > 0 && validTypes())}
          color={'vattjom'}
          onClick={() => handleCreateCategory()}>
          {t('common:buttons.create')}
        </Button>

        <Button
          variant={'tertiary'}
          color={'vattjom'}
          onClick={() => onClose()}>
          {t('common:buttons.close')}
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};