import { Button, Divider, Link, Logo, Header, Combobox , Avatar, Image, MenuVertical, useSnackbar } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';
import { useRouter } from 'next/router';
import { DialogCreateNamespace } from '@components/dialogs/dialog_create_namespace';
import { MainPageLabelsContent } from '@components/main-page-contents/main-page-labels.component';
import { MainPageCategoriesContent } from '@components/main-page-contents/main-page-categories.component';
import { MainPageContactreasonsContent } from '@components/main-page-contents/main-page-contactreasons.component';
import { MainPageRolesContent } from '@components/main-page-contents/main-page-roles.component';
import { MainPageErrandstatusesContent } from '@components/main-page-contents/main-page-errandstatuses.component';
import { MainPageEmailsettingsContent } from '@components/main-page-contents/main-page-emailsettings.component';

import { getMunicipalities, getNamespaces } from '@services/supportmanagement-service/supportmanagement-service';

export const MainPageSidebar: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const router = useRouter();
  const snackBar = useSnackbar();
  const { t } = useTranslation();
  const [municipalities, setMunicipalities] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState(null);
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const { pathname, asPath, query } = router;  
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const menuItems = [
    {id: 1, displayName: t('common:submenu.categories'), link: '/logout'},
    {id: 2, displayName: t('common:submenu.labels'), link: '/logout'},
    {id: 3, displayName: t('common:submenu.contactreasons'), link: '/logout'},
    {id: 4, displayName: t('common:submenu.roles'), link: '/logout'},
    {id: 5, displayName: t('common:submenu.errandstatuses'), link: '/logout'},
    {id: 6, displayName: t('common:submenu.emailconfiguration'), link: '/logout'}
  ];
  
  const handleSelectedMunicipalityId: React.ComponentProps<typeof Combobox.Input>['onChange'] = e => {
    if (e?.target?.value) {
      const selectedMember = municipalities.find(m => m.name === e.target.value);
      setSelectedMunicipalityId(selectedMember.municipalityId);
    }
  };
  
  const handleSelectedNamespace: React.ComponentProps<typeof Combobox.Input>['onChange'] = e => {
    if (e?.target?.value) {
      const selectedMember = namespaces.find(m => m.displayname === e.target.value);
      setSelectedNamespace(selectedMember.namespace);
    }
  };

  const openCreateDialogHandler = () => {
    setIsCreateDialogOpen(true);
  };

  const closeCreateDialogHandler = () => {
    setIsCreateDialogOpen(false);
  };

  const handleLanguageChange = (langValue: string) => {
    router.push({ pathname, query }, asPath, { locale: langValue });
  };
  
  const handleSelectedSubMenu = (menuIndex: number) => {
    setSelectedSubMenu(menuIndex);
    return false;
  };

  const showSection = (param: number) => {
    switch (param) {
      case 1:
        return <MainPageCategoriesContent
          title={menuItems.find(m => m.id === selectedSubMenu).displayName}
          municipalityId={selectedMunicipalityId}
          namespace={selectedNamespace}
        />
      case 2:
        return <MainPageLabelsContent
          title={menuItems.find(m => m.id === selectedSubMenu).displayName}
          municipalityId={selectedMunicipalityId}
          namespace={selectedNamespace}
        />
      case 3:
        return <MainPageContactreasonsContent
          title={menuItems.find(m => m.id === selectedSubMenu).displayName}
          municipalityId={selectedMunicipalityId}
          namespace={selectedNamespace}
        />
      case 4:
        return <MainPageRolesContent
          title={menuItems.find(m => m.id === selectedSubMenu).displayName}
          municipalityId={selectedMunicipalityId}
          namespace={selectedNamespace}
        />
      case 5:
        return <MainPageErrandstatusesContent
          title={menuItems.find(m => m.id === selectedSubMenu).displayName}
          municipalityId={selectedMunicipalityId}
          namespace={selectedNamespace}
        />
      case 6:
        return <MainPageEmailsettingsContent
          title={menuItems.find(m => m.id === selectedSubMenu).displayName}
          municipalityId={selectedMunicipalityId}
          namespace={selectedNamespace}
        />
      default:
        return null;
    }
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

  useEffect(() => {
    getMunicipalities()
      .then((res) => setMunicipalities(res))
      .catch((e) => {
        handleError('Error when loading municipalities:', e, t('common:errors.errorLoadingMunicipalities'));
    });
  }, []);

  useEffect(() => {
    setSelectedSubMenu(null);
    setSelectedNamespace(null);
    if (selectedMunicipalityId) {
      getNamespaces(selectedMunicipalityId)
        .then((res) => setNamespaces(res))
        .catch((e) => {
          handleError('Error when loading namespaces:', e, t('common:errors.errorLoadingNamespaces'));
      });
	}
  }, [selectedMunicipalityId]);

  useEffect(() => {
    setSelectedSubMenu(null);
  }, [selectedNamespace]);

  return (
  <>
    <DialogCreateNamespace open={isCreateDialogOpen} municipalityId={selectedMunicipalityId} onClose={closeCreateDialogHandler}/>  
    <aside
      data-cy="overview-aside"
      className="flex-none absolute z-10 bg-vattjom-background-200 h-full min-h-screen max-w-full w-full sm:w-[32rem] sm:min-w-[32rem]"
    >
      <div className="h-full w-full p-24">
        <NextLink
          href="/"
          className="no-underline"
          aria-label={t('common:title')}
        >
          <Logo
            variant="service"
            title={t('common:title')}
            subtitle={t('common:subtitle')}
          />
        </NextLink>
        <div className="shadow">
          <div/>
        </div>
        <div className="py-24 h-fit flex gap-12 items-center justify-between">
          <div className="flex gap-12 justify-between items-center">
            <Avatar
              data-cy="avatar-aside"
              className="flex-none user-avatar"
              size="md"
              initials={`${user.givenName.charAt(0)}${user.surname.charAt(0)}`}
              color="vattjom"
            />
            <span className="leading-tight h-fit font-bold mb-0" data-cy="userinfo">
              {user.givenName} {user.surname}
            </span>
          </div>
        </div>
        <Divider />

        <div className="flex flex-col gap-4">
          {selectedMunicipalityId && selectedNamespace && 
          <MenuVertical.Provider current={selectedSubMenu} setCurrent={handleSelectedSubMenu}>
            <MenuVertical.Sidebar>
              <MenuVertical>
                {menuItems.map(item => <MenuVertical.Item 
                  key={`mi-${item.id}`}
                  menuIndex={item.id} 
                >
                  <Link onClick={() => handleSelectedSubMenu(item.id)}>
                    <MenuVertical.ToolItem>
                      <span>{item.displayName}</span>
                    </MenuVertical.ToolItem>
                  </Link>
                </MenuVertical.Item>)}
              </MenuVertical>
            </MenuVertical.Sidebar>      
          </MenuVertical.Provider>}
        </div>
      </div>
    </aside>
    
    <div className="main-menu">
      <Header
        data-cy="nav-header"
      >
        <table>
          <tbody>
            <tr>
              <td>
                <Combobox>
                  <Combobox.Input
                    placeholder={t('common:mainmenu.select-municipality')}
                    searchPlaceholder={t('common:mainmenu.search-placeholder')}
                    multiple={false}
                    onChange={(e) => handleSelectedMunicipalityId(e)}
                  />
                  <Combobox.List>
                    {municipalities.map(item => <Combobox.Option key={item.municipalityId.toString()} value={item.municipalityId.toString()}>
                      {item.name}
                    </Combobox.Option>)}
                  </Combobox.List>
                </Combobox>

                <Combobox className="left-padded-10">
                  <Combobox.Input
                    disabled={selectedMunicipalityId === null}
                    placeholder={t('common:mainmenu.select-namespace')}
                    searchPlaceholder={t('common:mainmenu.search-placeholder')}
                    multiple={false}
                    value={selectedNamespace || ''}
                    onChange={(e) => handleSelectedNamespace(e)}
                  />
                  <Combobox.List>
                    {namespaces.map((item) => <Combobox.Option key={item.namespace} value={item.namespace}>
                      {item.displayname}
                    </Combobox.Option>)}
                  </Combobox.List>
                </Combobox>
                <div className={'left-padded-10'}>
                  <Button
                    disabled={selectedMunicipalityId === null}
                    color={'vattjom'}
                    onClick={() => openCreateDialogHandler()}
                  >
                    {t('common:mainmenu.new-namespace')}
                  </Button>
                </div>

              </td>
              <td>
              <div>
                <Button.Group>
                  <Button iconButton onClick={() => handleLanguageChange('sv')}>
                    <Image
                      alt="{t('common:mainmenu.swedish')}"
                      htmlHeight="42"
                      htmlWidth="26"
                      src={'/png/se.png'}
                    />
                  </Button>

                  <Button iconButton onClick={() => handleLanguageChange('en')}>
                    <Image
                      alt="{t('common:mainmenu.english')}"
                      htmlHeight="42"
                      htmlWidth="26"
                      src={'/png/en.png'}
                    />
                  </Button>

                  {user.name ?
                    <Button>
                      <NextLink href={`/logout`}>
                        <Link as="span" variant="link" className={'capitalize-first'}>
                          {t('common:logout')}
                        </Link>
                      </NextLink>
                    </Button>
                  : ''}
                </Button.Group>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Header>
    </div>
    <div className='main-area'>
      {showSection(selectedSubMenu)}
    </div>
  </>
  );
};
