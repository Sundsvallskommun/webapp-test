import { Button, Card, useSnackbar, Table, SortMode, Input, Pagination } from '@sk-web-gui/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { DialogManageStatus } from '@components/dialogs/dialog_manage_status';
import { getStatuses } from '@services/supportmanagement-service/supportmanagement-status-service';
import { StatusInterface } from '@interfaces/supportmanagement.status';
import { NamespaceInterface } from '@interfaces/supportmanagement.namespace';
import { MunicipalityInterface } from '@interfaces/supportmanagement.municipality';
import { toReadableTimestamp } from '@utils/dateformat';

interface MainPageStatusesProps {
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
}

export const MainPageStatusesContent: React.FC<MainPageStatusesProps> = ({ municipality, namespace }) => {
  const { t } = useTranslation();
  const [statuses, setStatuses] = useState<StatusInterface[]>([]);
  const [displayedStatuses, setDisplayedStatuses] = useState([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState(SortMode.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateStatusDialogOpen, setIsCreateStatusDialogOpen] = useState<boolean>(false);
  const snackBar = useSnackbar();

  const headers = [
    { label: t('common:index'), property: 'index', isColumnSortable: true },
    { label: t('common:subpages.statuses.table.headers.name'), property: 'name', isColumnSortable: true },
    { label: t('common:subpages.statuses.table.headers.created'), property: 'created', isColumnSortable: true },
    { label: t('common:subpages.statuses.table.headers.modified'), property: 'mofified', isColumnSortable: true },
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
  
  const loadStatuses = () => {
    if (municipality && namespace) {
      getStatuses(municipality.municipalityId, namespace.namespace)
        .then((res) => setStatuses(res))
        .catch((e) => {
          handleError('Error when loading statuses:', e, t('common:errors.errorLoadingStatuses'));
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

  const openCreateStatusDialog = () => {
    setIsCreateStatusDialogOpen(true);
  };

  const closeCreateStatusDialog = (reloadTable: boolean) => {
    if (reloadTable) {
      loadStatuses();
    }
    setIsCreateStatusDialogOpen(false);
  };

  const getPaginationText = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, statuses.length);

    return `${t('common:showing')} ${t('common:entry')} ${start} ${t('common:to')} ${end} ${t('common:of')} ${statuses.length}`;
  }
  
  useEffect(() => {
    loadStatuses();
  } ,[]);

  useEffect(() => {
    setStatuses(statuses.toSorted((a, b) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return a[sortColumn] < b[sortColumn] ? order : a[sortColumn] > b[sortColumn] ? order * -1 : 0;
    }));
  }, [sortColumn, sortOrder])

  useEffect(() => {
	setCurrentPage(1);
  }, [pageSize]);
  
  useEffect(() => {
    setDisplayedStatuses(statuses.slice((currentPage - 1) * pageSize, currentPage * pageSize));
  }, [statuses, pageSize, currentPage]);
  
  return (
    <>
      <DialogManageStatus
        open={isCreateStatusDialogOpen}
        municipality={municipality}
        namespace={namespace}
        onClose={closeCreateStatusDialog}/>  
      
      {statuses && statuses.length > 0 ? 
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
            {displayedStatuses.map(m => <Table.Row key={m.name}>
              <Table.Column>{m.index}</Table.Column>
              <Table.Column>{m.name}</Table.Column>
              <Table.Column>{m.created && toReadableTimestamp(m.created)}</Table.Column>
              <Table.Column>{m.modified && toReadableTimestamp(m.modified)}</Table.Column>
            </Table.Row>)}
          </Table.Body>

          <Table.Footer>
            <div className="sk-table-bottom-section">
              <div>
                <label className="sk-table-bottom-section-label" htmlFor="pagePageSize">
                  {t('common:subpages.statuses.table.rows_per_page')}:
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
                  pages={Math.ceil(statuses.length / pageSize)}
                  activePage={currentPage}
                  changePage={(page: number) => setCurrentPage(page)}
                />
              </div>
              {displayedStatuses[0] != undefined && <div>
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
                {t('common:subpages.statuses.missing')}
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      }
        
      <Button
        color={'vattjom'}
        onClick={() => openCreateStatusDialog()}>
        {t('common:buttons.add_status')}
      </Button>
    </>    
  );
};
