import { Button, Card, useSnackbar, Table, SortMode, Input, Pagination } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { DialogManageContactreason } from '@components/dialogs/dialog_manage_contactreason';
import { getContactreasons } from '@services/supportmanagement-service/supportmanagement-contactreason-service';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { toReadableTimestamp } from '@utils/dateformat';
import { ContactreasonInterface } from '@interfaces/supportmanagement.contactreason';
import { v4 } from 'uuid';

interface MainPageRolesProps {
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
}

export const MainPageContactreasonsContent: React.FC<MainPageRolesProps> = ({ municipality, namespace }) => {
  const { t } = useTranslation();
  const [contactreasons, setContactreasons] = useState<ContactreasonInterface[]>([]);
  const [displayedContactreasons, setDisplayedContactreasons] = useState<ContactreasonInterface[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState(SortMode.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isManageContactreasonDialogOpen, setIsManageContactreasonDialogOpen] = useState<boolean>(false);
  const [selectedContactreason, setSelectedContactreason] = useState<ContactreasonInterface>(null);
  const snackBar = useSnackbar();

  const headers = [
    { label: t('common:index'), property: 'index', isColumnSortable: true },
    { label: t('common:subpages.contactreasons.table.headers.reason'), property: 'reason', isColumnSortable: true },
    { label: t('common:subpages.contactreasons.table.headers.created'), property: 'created', isColumnSortable: true },
    { label: t('common:subpages.contactreasons.table.headers.modified'), property: 'mofified', isColumnSortable: true },
  ];

  const handleError = (errorDescription: string, e: Error, message: string) => {
    console.error(errorDescription, e);
    snackBar({
      message: message,
      status: 'error',
      position: 'top',
      closeable: false
    });
  };
 
  const loadContactreasons = () => {
    if (municipality && namespace) {
      getContactreasons(municipality.municipalityId, namespace.namespace)
        .then((res) => setContactreasons(res))
        .catch((e) => {
          handleError('Error when loading contactreasons:', e, t('common:errors.errorLoadingContractreasons'));
        });
    }
  };
  
  const handleSort = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const handlePageSizeChanged = (newPageSize: number) => {
    if (newPageSize > 0) {
      setPageSize(newPageSize);
    }
  };

  const openCreateContactreasonDialog = () => {
    setSelectedContactreason(null);
    setIsManageContactreasonDialogOpen(true);
  };

  const openModifyContactreasonDialog = (contactreason: ContactreasonInterface) => {
    setSelectedContactreason(contactreason);
    setIsManageContactreasonDialogOpen(true);
  };

  const closeManageContactreasonDialog = () => {
    setIsManageContactreasonDialogOpen(false);
  };

  useEffect(() => {
    if (!isManageContactreasonDialogOpen) {
      loadContactreasons();
    }
  } ,[isManageContactreasonDialogOpen]);

  const getPaginationText = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, contactreasons.length);

    return `${t('common:showing')} ${t('common:entry')} ${start} ${t('common:to')} ${end} ${t('common:of')} ${contactreasons.length}`;
  }

  useEffect(() => {
    loadContactreasons();
  } ,[]);

  useEffect(() => {
    setContactreasons(contactreasons.toSorted((a, b) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return a[sortColumn] < b[sortColumn] ? order : a[sortColumn] > b[sortColumn] ? order * -1 : 0;
    }));
    
  }, [sortColumn, sortOrder])

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  useEffect(() => {
    setDisplayedContactreasons(contactreasons.slice((currentPage - 1) * pageSize, currentPage * pageSize));
  }, [contactreasons, pageSize, currentPage]);

  return (
    <>
      <DialogManageContactreason
        key={v4()}
        open={isManageContactreasonDialogOpen}
        municipality={municipality}
        namespace={namespace}
        existingContactreason={selectedContactreason}
        onClose={closeManageContactreasonDialog}/>  

      
      {contactreasons && contactreasons.length > 0 ? 
        <Table background={true}>
          <Table.Header>
            {headers.map((h) => <Table.HeaderColumn key={h.property}>
              <Table.SortButton
                isActive={sortColumn === h.property}
                sortOrder={sortOrder}
                onClick={() => handleSort(h.property)}
              >
                {h.label}
              </Table.SortButton>
            </Table.HeaderColumn>)}
          </Table.Header>
          
          <Table.Body>
            {displayedContactreasons.map(m => <Table.Row key={m.reason}>
              <Table.Column>
                <Button
                  variant={'link'}
                  color={'vattjom'}
                  onClick={() => openModifyContactreasonDialog(m)}
                >
                  <LucideIcon name={'folder-pen'} size={18} />
                </Button>
                {m.index}
                </Table.Column>
              <Table.Column>{m.reason}</Table.Column>
              <Table.Column>{m.created && toReadableTimestamp(m.created)}</Table.Column>
              <Table.Column>{m.modified && toReadableTimestamp(m.modified) !== toReadableTimestamp(m.created) && toReadableTimestamp(m.modified)}</Table.Column>
            </Table.Row>)}
          </Table.Body>

          <Table.Footer>
            <div className="sk-table-bottom-section">
              <div>
                <label className="sk-table-bottom-section-label" htmlFor="pagePageSize">
                  {t('common:subpages.contactreasons.table.rows_per_page')}:
                </label>
                <Input
                  size="sm"
                  id="pagePageSize"
                  type="number"
                  className="max-w-[6rem]"
                  value={`${pageSize}`}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    event.target.value && handlePageSizeChanged(parseInt(event.target.value))
                  }
                />
              </div>
              <div>
                <Pagination
                  pages={Math.ceil(contactreasons.length / pageSize)}
                  activePage={currentPage}
                  changePage={(page: number) => setCurrentPage(page)}
                />
              </div>
              {displayedContactreasons[0] != undefined && <div>
                <label className="sk-table-bottom-section-label capitalize-first">
                  {getPaginationText()}
                </label>
              </div>}
            </div>
          </Table.Footer>
        </Table>
      : 
        <Card color={'tertiary'}>
          <Card.Body>
            <Card.Text>
              <div className="capitalize-first">
                {t('common:subpages.contactreasons.missing')}
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      }
        
      <Button
        leftIcon={<LucideIcon name={'square-plus'} />} 
        color={'vattjom'}
        onClick={() => openCreateContactreasonDialog()}>
        {t('common:buttons.add_contactreason')}
      </Button>
    </>    
  );
};
