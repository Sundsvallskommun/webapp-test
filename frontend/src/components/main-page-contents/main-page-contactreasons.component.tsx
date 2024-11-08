import { Button, Card, useSnackbar, Table, SortMode, Input, Pagination } from '@sk-web-gui/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { DialogManageContactreason } from '@components/dialogs/dialog_manage_contactreason';
import { getContactreasons } from '@services/supportmanagement-service/supportmanagement-contactreason-service';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { toReadableTimestamp } from '@utils/dateformat';
import { ContactreasonInterface } from '@interfaces/supportmanagement.contactreason';

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
  const [isCreateContactreasonDialogOpen, setIsCreateContactreasonDialogOpen] = useState<boolean>(false);
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
    setIsCreateContactreasonDialogOpen(true);
  };

  const closeCreateContactreasonDialog = (reloadTable: boolean) => {
    if (reloadTable) {
      loadContactreasons();
    }
    setIsCreateContactreasonDialogOpen(false);
  };

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
        open={isCreateContactreasonDialogOpen}
        municipality={municipality}
        namespace={namespace}
        onClose={closeCreateContactreasonDialog}/>  

      
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
              <Table.Column>{m.index}</Table.Column>
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
        color={'vattjom'}
        onClick={() => openCreateContactreasonDialog()}>
        {t('common:buttons.add_contactreason')}
      </Button>
    </>    
  );
};
