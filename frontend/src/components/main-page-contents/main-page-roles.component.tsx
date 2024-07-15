import { Button, Card, useSnackbar, Table, SortMode, Input, Pagination } from '@sk-web-gui/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { DialogManageRole } from '@components/dialogs/dialog_manage_role';
import { getRoles } from '@services/supportmanagement-service/supportmanagement-roles-service';
import { MunicipalityInterface, NamespaceInterface } from '@interfaces/supportmanagement';
import { toReadableTimestamp } from '@utils/dateformat';

interface MainPageRolesProps {
  municipality: MunicipalityInterface;
  namespace: NamespaceInterface;
}

export const MainPageRolesContent: React.FC<MainPageRolesProps> = ({ municipality, namespace }) => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [displayedRoles, setDisplayedRoles] = useState([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState(SortMode.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState<boolean>(false);
  const snackBar = useSnackbar();

  const headers = [
    { label: t('common:subpages.roles.table.headers.name'), property: 'name', isColumnSortable: true },
    { label: t('common:subpages.roles.table.headers.created'), property: 'created', isColumnSortable: true },
    { label: t('common:subpages.roles.table.headers.modified'), property: 'mofified', isColumnSortable: true },
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
  
  const loadRoles = () => {
    if (municipality && namespace) {
      getRoles(municipality.municipalityId, namespace.namespace)
        .then((res) => setRoles(res))
        .catch((e) => {
          handleError('Error when loading roles:', e, t('common:errors.errorLoadingRoles'));
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

  const openCreateRoleDialog = () => {
    setIsCreateRoleDialogOpen(true);
  };

  const closeCreateRoleDialog = (reloadTable: boolean) => {
    if (reloadTable) {
      loadRoles();
    }
    setIsCreateRoleDialogOpen(false);
  };

  useEffect(() => {
    loadRoles();
  } ,[]);


  useEffect(() => {
    setRoles(roles.toSorted((a, b) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return a[sortColumn] < b[sortColumn] ? order : a[sortColumn] > b[sortColumn] ? order * -1 : 0;
    }));
  }, [sortColumn, sortOrder])

  useEffect(() => {
    setDisplayedRoles(roles.slice((currentPage - 1) * pageSize, currentPage * pageSize));
  }, [roles, pageSize, currentPage]);
  
  return (
    <>
      <DialogManageRole
        open={isCreateRoleDialogOpen}
        municipality={municipality}
        namespace={namespace}
        onClose={closeCreateRoleDialog}/>  
      
      {roles && roles.length > 0 ? 
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
            {displayedRoles.map(m => <Table.Row key={m.name}>
              <Table.Column>{m.name}</Table.Column>
              <Table.Column>{m.created && toReadableTimestamp(m.created)}</Table.Column>
              <Table.Column>{m.modified && toReadableTimestamp(m.modified)}</Table.Column>
            </Table.Row>)}
          </Table.Body>

          <Table.Footer>
            <div className="sk-table-bottom-section">
              <div>
              <label className="sk-table-bottom-section-label" htmlFor="pagePageSize">
                {t('common:subpages.roles.table.rows_per_page')}:
              </label>
              <Input
                size="sm"
                id="pagePageSize"
                type="number"
                min={1}
                max={100}
                className="max-w-[6rem]"
                value={`${pageSize}`}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  event.target.value && setPageSize(parseInt(event.target.value))
                }
              />
              </div>
              <div>
                <Pagination
                  pages={Math.ceil(roles.length / pageSize)}
                  activePage={currentPage}
                  changePage={(page: number) => setCurrentPage(page)}
                />
              </div>
            </div>
          </Table.Footer>
        </Table>
      : 
        <Card color={'tertiary'}>
          <Card.Body>
            <Card.Text>
              <div className="capitalize-first">
                {t('common:subpages.roles.missing')}
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
       }
        
      <Button
        color={'vattjom'}
        onClick={() => openCreateRoleDialog()}>
        {t('common:buttons.add_role')}
      </Button>
    </>    
  );
};
