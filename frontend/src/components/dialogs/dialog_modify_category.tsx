import { Button, Dialog, Input, useSnackbar, Icon, Table, SnackbarProps } from '@sk-web-gui/react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { CategoryInterface, CategoryUpdateRequestInterface } from '@interfaces/supportmanagement.category';
import { updateCategory, deleteCategory } from '@services/supportmanagement-service/supportmanagement-category-service';

interface ModifyCategoryProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  category: CategoryInterface | null;
  onClose: () => void;
}

export const DialogModifyCategory: React.FC<ModifyCategoryProps> = ({
  open,
  municipality,
  namespace,
  category,
  onClose,
}) => {
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const snackBar = useSnackbar();
  const [categoryProspect, setCategoryProspect] = useState<CategoryUpdateRequestInterface>();
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const { t } = useTranslation();
  const escFunction = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, []);

  const handleError = (errorDescription: string, e: Error, message: string) => {
    console.error(errorDescription, e);
    displayMessage(message, 'error');
  };

  const displayMessage = (message: string, messageType: SnackbarProps['status']) => {
    snackBar({
      message: message,
      status: messageType,
      className: 'middle',
      position: 'top',
      closeable: false,
    });
  };

  const handleDisplayNameInputChange = (input: string) => {
    setCategoryProspect({ ...categoryProspect, displayName: input });
  };

  const handleAddCategoryType = () => {
    setCategoryProspect({
      ...categoryProspect,
      types: [
        ...categoryProspect.types,
        {
          name: '',
          displayName: '',
          escalationEmail: '',
          existing: false,
        },
      ],
    });
  };

  const handleTypeNameInputChange = (idx: number, input: string) => {
    const validatedInput = input.replace(/[^A-Z0-9_\\.]/gi, '');
    const future = { ...categoryProspect };
    future.types[idx].name = validatedInput.toUpperCase();
    setCategoryProspect(future);
  };

  const handleTypeDisplayNameInputChange = (idx: number, input: string) => {
    const future = { ...categoryProspect };
    future.types[idx].displayName = input;
    setCategoryProspect(future);
  };

  const handleTypeEscalationEmailInputChange = (idx: number, input: string) => {
    const future = { ...categoryProspect };
    future.types[idx].escalationEmail = input.toLowerCase();
    setCategoryProspect(future);
  };

  const handleTypeRemoval = (idx: number) => {
    const future = { ...categoryProspect };
    future.types.splice(idx, 1);
    setCategoryProspect(future);
  };

  const handleUpdateCategory = () => {
    setSaving(true);
    updateCategory(municipality.municipalityId, namespace.namespace, categoryProspect)
    .then(() => onClose())
    .catch((e) => {
      handleError('Error when updating category:', e, t('common:errors.errorUpdatingCategory'));
    })
    .finally(() => setSaving(false));
  };

  const confirmDelete = () => {
    setConfirmOpen(true);
  };

  const handleOnAbort = () => {
    setConfirmOpen(false);
  };

  const handleDeleteCategory = () => {
    setConfirmOpen(false);

    deleteCategory(municipality.municipalityId, namespace.namespace, category.name)
    .then(() => setSaving(false))
    .then(() => onClose())
    .catch((e) => {
      handleError('Error when deleting category:', e, t('common:errors.errorDeletingCategory'));
    });
  }

  const validEmail = (email: string) => {
    return !email || email.length === 0 || RegExp(emailRegex).exec(email);
  };

  const uniqueNames = (): boolean => {
    // Validate that name and displayName is only present once in type-list
    let allValid = true;

    categoryProspect?.types.map((m) => {
      if (categoryProspect.types.filter((d) => d.name === m.name).length > 1) {
        allValid = false;
      }
      if (categoryProspect.types.filter((d) => d.displayName === m.displayName).length > 1) {
        allValid = false;
      }
    });

    return allValid;
  };

  const validTypes = (): boolean => {
    let allValid = true;
    categoryProspect?.types.map((m) => {
      if (m.name.length == 0 || m.displayName.length == 0 || !validEmail(m?.escalationEmail || '')) {
        allValid = false;
      }
    });

    return allValid && uniqueNames();
  };

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    // Initialize update prospect and remove created and modified dates as they is not allowed to be set on update
    const types = category?.types.map((type) => ({
      name: type.name,
      displayName: type.displayName,
      existing: true,
      escalationEmail: type.escalationEmail,
    }));

    setCategoryProspect({
      name: category.name,
      displayName: category.displayName,
      types: types,
    });
  }, []);

  return (
    <Dialog
      show={open}
      label={`${t('common:dialogs.manage_category.modify_header_prefix')} ${category.displayName} ${t('common:for')} ${t('common:domain')} ${namespace.displayName} ${t('common:in')} ${municipality.name}`}
      className="md:min-w-[120rem] dialog"
    >
      <Dialog.Content>
        <Dialog
          label={t('common:dialogs.confirm_header')}
          className="dialog"
          show={confirmOpen}
        >
          <Dialog.Content>
            <div className="bottom-margin-50">
              {t('common:dialogs.manage_category.confirm_delete')}
            </div>
          </Dialog.Content>
          <Dialog.Buttons className={'container-right'}>
            <Button color={'vattjom'} onClick={() => handleDeleteCategory()}>
              {t('common:buttons.confirm')}
            </Button>
            <Button variant={'tertiary'} color={'vattjom'} onClick={() => handleOnAbort()}>
              {t('common:buttons.abort')}
            </Button>
          </Dialog.Buttons>
        </Dialog>      

        <div className="d-flex">
          <div>
            <p>{t('common:dialogs.manage_category.category_name_input_heading')}:</p>
          </div>
          <div>
            <button disabled className="sk-chip chip-input">
              {categoryProspect?.name}
            </button>
          </div>

          <div>
            <p>{t('common:dialogs.manage_category.category_display_name_input_heading')}:</p>
          </div>
          <div className="d-flex">
            <Input
              id={'category-displayname'}
              maxLength={250}
              placeholder={t('common:dialogs.manage_category.displayname_placeholder')}
              invalid={categoryProspect?.displayName.length === 0 ? true : undefined}
              value={categoryProspect?.displayName || ''}
              onChange={(e) => handleDisplayNameInputChange(e.target.value)}
            />
          </div>
        </div>

        {categoryProspect?.types.length > 0 && (
          <Table className={'top-margin-50 fixed-height'} background={false}>
            <Table.Header>
              <Table.HeaderColumn key={'header_name'}>
                {t('common:dialogs.manage_category.categorytype_name_input_heading')}
              </Table.HeaderColumn>
              )
              <Table.HeaderColumn key={'header_display_name'}>
                {t('common:dialogs.manage_category.categorytype_display_name_input_heading')}
              </Table.HeaderColumn>
              )
              <Table.HeaderColumn key={'header_escalation_email'}>
                {t('common:dialogs.manage_category.categorytype_escalation_email_input_heading')}
              </Table.HeaderColumn>
              )
            </Table.Header>
            <Table.Body>
              {categoryProspect?.types.map((m, idx) => (
                <Table.Row key={'type_input' + idx}>
                  <Table.Column>
                    {m.existing ?
                      <button
                        disabled
                        className={
                          m.name.length === 0 || !uniqueNames() ?
                            'sk-chip chip-input chip-input-error'
                          : 'sk-chip chip-input'
                        }
                      >
                        {m.name}
                      </button>
                    : <Input
                        placeholder={t('common:dialogs.manage_category.type_name_placeholder')}
                        invalid={m.name.length === 0 || !uniqueNames() ? true : undefined}
                        value={m.name}
                        onChange={(e) => handleTypeNameInputChange(idx, e.target.value)}
                      />
                    }
                  </Table.Column>
                  <Table.Column>
                    <Input
                      placeholder={t('common:dialogs.manage_category.displayname_placeholder')}
                      invalid={m.displayName.length === 0 || !uniqueNames() ? true : undefined}
                      value={m.displayName}
                      onChange={(e) => handleTypeDisplayNameInputChange(idx, e.target.value)}
                    />
                  </Table.Column>
                  <Table.Column>
                    <Input.Group invalid={!validEmail(m.escalationEmail) ? true : undefined}>
                      <Input.RightAddin icon>
                        <Input
                          className={'email'}
                          placeholder={t('common:dialogs.manage_category.escalation_email_placeholder')}
                          value={m.escalationEmail}
                          onChange={(e) => handleTypeEscalationEmailInputChange(idx, e.target.value)}
                        />

                        <Icon name={validEmail(m.escalationEmail) ? undefined : 'shield-x'} color={'error'} />
                      </Input.RightAddin>
                    </Input.Group>

                    <Button
                      disabled={m.existing}
                      className={m.existing && 'disabled'}
                      color={m.existing ? 'primary' : 'vattjom'}
                      variant={'link'}
                      iconButton
                      onClick={() => handleTypeRemoval(idx)}
                    >
                      <Icon name={'trash-2'} />
                    </Button>
                  </Table.Column>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Dialog.Content>
      <Dialog.Buttons className={'container-right'}>
        <Button disabled={saving} color={'vattjom'} onClick={() => handleAddCategoryType()}>
          {t('common:dialogs.manage_category.add_categorytype')}
        </Button>

        <Button
          loading={saving}
          disabled={!(categoryProspect?.name.length > 0 && categoryProspect?.displayName.length > 0 && validTypes())}
          color={'vattjom'}
          onClick={() => handleUpdateCategory()}
        >
          {t('common:buttons.update')}
        </Button>
        <Button
          color={'juniskar'}
          onClick={() => confirmDelete()}
        >
          {t('common:buttons.delete')}
        </Button>

        <Button variant={'tertiary'} color={'vattjom'} onClick={() => onClose()}>
          {t('common:buttons.close')}
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};
