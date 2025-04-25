import { Button, Link, Dialog, Input, useSnackbar, Table, IconProps, SnackbarProps } from '@sk-web-gui/react';
import { List } from '@sk-web-gui/list';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { createLabels, updateLabels } from '@services/supportmanagement-service/supportmanagement-label-service';
import { LabelInterface } from '@interfaces/supportmanagement.label';
import { v4 } from 'uuid';
import _ from "lodash";

interface ManageLabelProps {
  open: boolean;
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
  existingLabel: LabelInterface | null;
  existingLabelStructure: LabelInterface[];
  onClose: () => void;
}

export const DialogManageLabel: React.FC<ManageLabelProps> = ({
  open,
  municipality,
  namespace,
  existingLabel,
  existingLabelStructure,
  onClose,
}) => {
  const { t } = useTranslation();
  const snackBar = useSnackbar();
  const [saving, setSaving] = useState<boolean>(false);
  const [childClassification, setChildClassification] = useState<string>('');
  const [labelProspect, setLabelProspect] = useState<LabelInterface>();
  const [labelStructure, setLabelStructure] = useState<LabelInterface[]>();
  const [nameViolations, setNameViolations] = useState<string[]>([]);
  const [showDuplicatesDialog, setShowDuplicatesDialog] = useState<boolean>(false);
  
  const escFunction = useCallback((event) => {
    if (event.key === 'Escape') {
      handleOnClose();
    }
  }, []);

  const handleOnClose = () => {
    onClose();
  };

  const displayError = (message: string) => {
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

  const switchToLabel = (fullName: string) => {
    try {
      setSaving(true);
      const futureLabelStructure = _.cloneDeep(labelStructure);
      const listWithMatch = findLabelList(labelProspect.uuid, futureLabelStructure) || [];
      const matchingChildIdx = listWithMatch.findIndex(member => member.uuid === labelProspect.uuid);
    
      if (matchingChildIdx != -1) { // List where matching item is present has been found
        listWithMatch[matchingChildIdx] = labelProspect;
      } else {
        futureLabelStructure.push(labelProspect);
      }

      const possibleNameViolations = getPossibleDuplicateNames(futureLabelStructure);
      if (possibleNameViolations.length > 0) {
        setNameViolations(possibleNameViolations);
        setShowDuplicatesDialog(true);
        return;
      }
      setLabelStructure(futureLabelStructure);

      const futureLabelProspect = findLabel(fullName, futureLabelStructure);
      setLabelProspect(futureLabelProspect);
      setChildClassification(futureLabelProspect?.labels?.[0]?.classification || null);
    } finally {
      setSaving(false);
    }
  };

  const findLabelList = (uuid: string, nodes: LabelInterface[]): LabelInterface[] => {
    for (const index in nodes) {
      const node = nodes[index];
      if (node.uuid == uuid) {
        return nodes;
      } else if (!node.isLeaf) {
        const match = findLabelList(uuid, node.labels);
        if (match != null) {
          return match;
        }
      }
    }
    return null;
  };
  
  const findLabel = (fullName: string, nodes: LabelInterface[]): LabelInterface => {
    for (const index in nodes) {
      const node = nodes[index];
      const nodeFullName = (node.prefix?.length || 0) === 0 ? node.name : node.prefix + '.' + node.name;

      if (nodeFullName === fullName) {
        return node;
      } else if (!node.isLeaf) {
        const match = findLabel(fullName, node.labels);
        if (match != null) {
          return match;
        }
      }
    }
    return null;
  }  

  const washInput = (input: string): string => {
    const validatedInput = input.replace(/[^A-Z0-9()_-]/gi, '');
    return validatedInput ? String(validatedInput).toUpperCase() : validatedInput;
  };

  const handleNameInputChange = (input: string) => {
    const future = { ...labelProspect, name: washInput(input) };
    future.labels?.forEach((m) => {
      m.prefix = future.name;
    });

    setLabelProspect(future);
  };

  const handleClassificationInputChange = (input: string) => {
    setLabelProspect({ ...labelProspect, classification: washInput(input) });
  };
  
  const handleDisplayNameInputChange = (input: string) => {
    setLabelProspect({ ...labelProspect, displayName: input });
  };

  const handleChildNameInputChange = (idx: number, input: string) => {
    const future = { ...labelProspect };
    future.labels[idx].name = washInput(input);
    setLabelProspect(future);
  };

  const handleChildDisplayNameInputChange = (idx: number, input: string) => {
    const future = { ...labelProspect };
    future.labels[idx].displayName = input;
    setLabelProspect(future);
  };
  
  const handleChildClassificationInputChange = (idx: number, input: string) => {
    const future = { ...labelProspect };
    future.labels[idx].classification = washInput(input);
    setLabelProspect(future);

    setChildClassification(future.labels[idx].classification);
  };
  
  const handleAddChild = () => {
    const future = {
      ...labelProspect,
      isLeaf: false,
      labels: [
        ...labelProspect.labels || [],
        {
          prefix: labelProspect.prefix ? labelProspect.prefix + '.' + labelProspect.name : labelProspect.name,
          name: '',
          displayName: '',
          classification: childClassification,
          uuid: v4(),
          isNew: true,
          isLeaf: true,
          labels: null, 
        },
      ],
    };

    setLabelProspect(future);
  };

  const handleRemoveChild = (idx: number) => {
    const future = { ...labelProspect };
    future.labels.splice(idx, 1);
    future.isLeaf = future.labels.length == 0;
    setLabelProspect(future);
  };
  
  const existingChildrenExists = () => {
    return labelProspect?.labels.some((item) => item['isNew'] === undefined);
  }
  
  const hasUniqueDisplayNames = (): boolean => {
    // Validate that displayName is only present once in child-list
    let allValid = true;

    labelProspect?.labels?.map((m) => {
      if (labelProspect.labels.filter((d) => d.displayName === m.displayName).length > 1) {
        allValid = false;
      }
    });

    return allValid;
  };

  const hasUniqueNames = (): boolean => {
    // Validate that name is only present once in child-list
    let allValid = true;

    labelProspect?.labels?.map((m) => {
      if (labelProspect.labels.filter((d) => d.name === m.name).length > 1) {
        allValid = false;
      }
    });

    return allValid;
  };

  const validChilds = (): boolean => {
    let allHasValues = true;
    labelProspect?.labels?.map((m) => {
      if (m.name.length == 0 || m.classification?.length == 0 || m.displayName.length == 0) {
        allHasValues = false;
      }
    });

    return allHasValues && hasUniqueNames() && hasUniqueDisplayNames();
  };

  const showDisplayIcon = (icon: string): React.ComponentPropsWithoutRef<IconProps['Component']>['id'] => {
    if (icon === '') return undefined;
    return icon;
  };

  const handleSaveLabels = () => {
    setSaving(true);

    const futureLabelStructure = _.cloneDeep(labelStructure);
    const listWithMatch = findLabelList(labelProspect.uuid, futureLabelStructure) || [];
    const matchingChildIdx = listWithMatch.findIndex(member => member.uuid === labelProspect.uuid);

    if (matchingChildIdx != -1) { // List where matching item is present has been found
      listWithMatch[matchingChildIdx] = labelProspect;
    } else {
      futureLabelStructure.push(labelProspect);
    }

    const possibleNameViolations = getPossibleDuplicateNames(futureLabelStructure);
    if (possibleNameViolations.length > 0) {
      setNameViolations(possibleNameViolations);
      setShowDuplicatesDialog(true);
      setSaving(false);
      return;
    }

    if (existingLabelStructure) {
      updateLabels(municipality.municipalityId, namespace.namespace, {labels: futureLabelStructure } )
        .then(() => handleOnClose())
        .catch((e) => {
          displayError(t('common:errors.errorUpdatingLabels'));
        })
        .finally(() => setSaving(false));

    } else {
      createLabels(municipality.municipalityId, namespace.namespace, {labels: futureLabelStructure})
        .then(() => handleOnClose())
        .catch((e) => {
          displayError(t('common:errors.errorCreatingLabels'));
        })
        .finally(() => setSaving(false));
    }
  };

  const getPossibleDuplicateNames = (structure: LabelInterface[]): string[] => {
    if (structure) {
      const names = flatten(structure)
        .map(entry => entry.prefix ? entry.prefix + '.' + entry.name : entry.name);

      return Array.from(new Set(names.filter((name, index) => names.some((match, idx) => match === name && idx !== index))));
    }
    return [];
  }
  
  const flatten = (array: LabelInterface[]) : LabelInterface[] => {
    let result = [];
    array.forEach(function (a) {
      result.push(a);
      if (Array.isArray(a.labels)) {
        result = result.concat(flatten(a.labels));
      }
    });
    
    return result;
  };
  
  const closeDuplicatesDialog = () => {
    setShowDuplicatesDialog(false);
  }
  
  useEffect(() => {
    const future = {...labelProspect };

    future.labels = future?.labels?.map(label => {
      return {...label, classification: childClassification};
    });  
    
    setLabelProspect(future);
  }, [childClassification]);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    setLabelStructure(existingLabelStructure ? _.cloneDeep(existingLabelStructure) : []);

    if (!existingLabel?.isLeaf) {
      setChildClassification(existingLabel?.labels[0].classification);
    }
  
    setLabelProspect({
      prefix: existingLabel?.prefix || '',
      name: existingLabel?.name || '',
      displayName: existingLabel?.displayName || '',
      classification: existingLabel?.classification || existingLabelStructure?.[0]?.classification || '',
      uuid: existingLabel?.uuid || v4(),
      isNew: existingLabel == null,
      isLeaf: existingLabel?.labels == undefined || existingLabel?.labels.length == 0,
      labels: existingLabel?.labels || [],
    });
  }, []);

  return (
    <Dialog
      show={open}
      label={existingLabel ? `${t('common:dialogs.manage_label.header_prefix_modify')} ${existingLabel?.displayName} ${t('common:in')} ${municipality?.name}` : 
         `${t('common:dialogs.manage_label.header_prefix_create')} ${namespace?.displayName} ${t('common:in')} ${municipality?.name}`}
      className="md:min-w-[140rem] dialog"
    >
      <Dialog.Content>
        <Dialog
          label={t('common:dialogs.manage_label.duplicate_names_header')}
          className="dialog"
          show={showDuplicatesDialog}
        >
          <Dialog.Content>
            <div className="bottom-margin-50">
              {t('common:dialogs.manage_label.duplicates_found_prefix')}
              <List
                className="bottom-margin-100"
                listStyle={"numbered"}
              >
                {nameViolations.map((violation, idx) => (
                <List.Item key={"violation" + idx}>
                  <List.Text>
                    <b>{violation}</b>
                  </List.Text>
                </List.Item>
                ))}
              </List>
              <div>
                {t('common:dialogs.manage_label.duplicates_found_suffix')}
              </div>
            </div>
          </Dialog.Content>
          <Dialog.Buttons className={'container-right'}>
            <Button 
              leftIcon={<LucideIcon name={'folder-output'} />} 
              variant={'tertiary'} 
              color={'vattjom'} 
              onClick={() => closeDuplicatesDialog()}>
              {t('common:buttons.close')}
            </Button>
          </Dialog.Buttons>
        </Dialog>      
      
        {/* Section for parent settings */}
        <div className="d-flex bottom-margin-50">
          <div>
            <p>{t('common:dialogs.manage_label.name_input_heading')}:</p>
          </div>
          <div>
            {(labelProspect?.prefix || '').length > 0 &&
            <span>
              {(labelProspect?.name || '').length > 0 && validChilds() &&
              <Link onClick={() => switchToLabel(`${labelProspect?.prefix}`)}>
                <LucideIcon className="right-margin-50 label-up-navigation-icon hand-icon" size={18} name={'folder-up'}/>
              </Link>}

              {((labelProspect?.name || '').length == 0 || !validChilds()) && 
              <LucideIcon className="right-margin-50 label-up-navigation-icon" size={18} name={'folder-up'} />}
            </span>
            }
             
            {(labelProspect?.prefix || '').length == 0 &&
            <LucideIcon className="right-margin-50 label-up-navigation-icon" size={18} name={'folder-root'} />}
            
            {existingLabel ?
            <button disabled className="sk-chip chip-input">
              <span>
                {labelProspect?.prefix &&
                <span>
                    {labelProspect?.prefix}
                  .
                </span>}
                {labelProspect?.name}
              </span>
            </button>
            :
            <Input.Group className="sk-inline-flex">
              <Input.LeftAddin>
                {labelProspect?.prefix}{labelProspect?.prefix && <>.</>}
              </Input.LeftAddin>
              <Input className={'smaller'}
                size={'md'}
                maxLength={250}
                placeholder={t('common:dialogs.manage_label.name_placeholder')}
                value={labelProspect?.name || ''}
                onChange={(e) => handleNameInputChange(e.target.value)}
              />
              <Input.RightAddin>
                <LucideIcon
                  name={
                    labelProspect?.name?.length > 0 ? showDisplayIcon('') : showDisplayIcon('shield-alert')
                  }
                  color={'warning'}
                />
              </Input.RightAddin>
            </Input.Group>
            }
          </div>
          
          <div>
            <p>{t('common:dialogs.manage_label.classification_input_heading')}:</p>
          </div>
          <div>
            {existingLabel || existingLabelStructure?.[0]?.classification != null ? 
            <button disabled className="sk-chip chip-input">
              {labelProspect?.classification}
            </button>
            :
            <Input
              id={'label-classification'}
              maxLength={250}
              placeholder={t('common:dialogs.manage_label.classification_placeholder')}
              invalid={labelProspect?.classification?.length === 0 ? true : undefined}
              value={labelProspect?.classification || ''}
              onChange={(e) => handleClassificationInputChange(e.target.value)}
            />}
          </div>

          <div>
            <p>{t('common:dialogs.manage_label.display_name_input_heading')}:</p>
          </div>
          <div>
            <Input
              id={'label-displayname'}
              maxLength={250}
              placeholder={t('common:dialogs.manage_label.displayname_placeholder')}
              invalid={labelProspect?.displayName?.length === 0 ? true : undefined}
              value={labelProspect?.displayName || ''}
              onChange={(e) => handleDisplayNameInputChange(e.target.value)}
            />
          </div>
        </div>
      
        {/* Section for children settings */}
        {!labelProspect?.isLeaf && (
        <Table className={'fixed-height'} background={false}>
          <Table.Header>
            <Table.HeaderColumn key={'header_name'}>
              {t('common:dialogs.manage_label.name_input_heading')}
            </Table.HeaderColumn>
            <Table.HeaderColumn key={'header_classification'}>
              {t('common:dialogs.manage_label.classification_input_heading')}
            </Table.HeaderColumn>
            <Table.HeaderColumn key={'header_display_name'}>
              {t('common:dialogs.manage_label.display_name_input_heading')}
            </Table.HeaderColumn>
          </Table.Header>
          <Table.Body>
            {labelProspect?.labels?.map((m, idx) => (
              <Table.Row key={'child_name_input' + m.uuid}>
                <Table.Column>
                  <Link 
                    disabled={!(labelProspect?.name?.length > 0 && labelProspect?.classification?.length > 0 && labelProspect?.displayName?.length > 0 && validChilds())} 
                    onClick={() => switchToLabel(`${m?.prefix}.${m?.name}`)}>
                    <LucideIcon size={18} className={m?.name && 'hand-icon'} name={'folder-down'}/>
                  </Link>

                  {!m.isNew ?
                  <button
                    disabled
                    className={
                      m?.name.length === 0 || !hasUniqueNames() ?
                        'sk-chip chip-input max-width chip-input-error'
                      : 'sk-chip chip-input max-width'
                    }
                  >
                    {m.prefix}.{m.name}
                  </button>
                  :
                  <Input.Group className={'max-width'}>
                    <Input.LeftAddin>
                      {m?.prefix}{m?.prefix && <>.</>}
                    </Input.LeftAddin>
                    <Input className={'smaller'}
                      size={'md'}
                      placeholder={t('common:dialogs.manage_label.name_placeholder')}
                      value={m.name}
                      onChange={(e) => handleChildNameInputChange(idx, e.target.value)}
                    />
                    <Input.RightAddin>
                      <LucideIcon
                        name={
                          m.name.length > 0 && hasUniqueNames() ? showDisplayIcon('') : showDisplayIcon('shield-alert')
                        }
                        color={'warning'}
                      />
                    </Input.RightAddin>
                  </Input.Group>}
                </Table.Column>
                <Table.Column>
                  <Input
                    placeholder={t('common:dialogs.manage_label.classification_placeholder')}
                    invalid={childClassification && childClassification.length > 0 ? undefined : true}
                    value={m.classification}
                    disabled={existingChildrenExists()}
                    onChange={(e) => handleChildClassificationInputChange(idx, e.target.value)}
                  />
                </Table.Column>
                <Table.Column>
                  <Input
                    placeholder={t('common:dialogs.manage_label.displayname_placeholder')}
                    invalid={m.displayName.length === 0 || !hasUniqueDisplayNames() ? true : undefined}
                    value={m.displayName}
                    onChange={(e) => handleChildDisplayNameInputChange(idx, e.target.value)}
                  />
                  <Button
                    disabled={!m.isNew}
                    className={!m.isNew && 'disabled'}
                    color={'vattjom'}
                    variant={'link'}
                    iconButton
                    onClick={() => handleRemoveChild(idx)}
                  >
                    <LucideIcon size={20} name={'trash-2'} />
                  </Button>
                </Table.Column>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>)}
      </Dialog.Content>
      
      <Dialog.Buttons className={'container-right'}>
        <Button 
          disabled={saving} 
          leftIcon={<LucideIcon name={'square-plus'} />} 
          color={'vattjom'} 
          onClick={() => handleAddChild()}>
          {t('common:dialogs.manage_label.add_child')}
        </Button>
        <Button
          loading={saving}
          leftIcon={<LucideIcon name={'save'} />} 
          disabled={!(labelProspect?.name?.length > 0 && labelProspect?.classification?.length > 0 && labelProspect?.displayName?.length > 0 && validChilds())}
          color={'vattjom'}
          onClick={() => handleSaveLabels()}
        >
          {existingLabelStructure ? t('common:buttons.update') : t('common:buttons.create')}
        </Button>
        <Button 
          variant={'tertiary'} 
          leftIcon={<LucideIcon name={'folder-output'} />} 
          color={'vattjom'} 
          onClick={() => handleOnClose()}>
          {t('common:buttons.close')}
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};
