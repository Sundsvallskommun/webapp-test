import { useUserStore } from '@services/user-service/user-service';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '@layouts/default-layout/default-layout.component';

export const Startpage: React.FC = () => {
  return (
    <DefaultLayout title={'SupportMgmnt Admin'} />
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'layout'])),
  },
});

export default Startpage;
