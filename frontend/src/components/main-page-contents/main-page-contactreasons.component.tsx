import { Button, Divider, Link, Logo, Header, Combobox , Avatar, Image, MenuVertical } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';
import { useRouter } from 'next/router';

interface MainPageContactreasonsProps {
  title: string;
  municipalityId: string;
  namespace: string;
}

export const MainPageContactreasonsContent: React.FC<MainPageContactreasonsProps> = ({ title, municipalityId, namespace }) => {
  const { t } = useTranslation();

  return (
  <div>
    <h3>
      {title}
    </h3>
    [Implement contract reasons page by generating CRUD-logic for {municipalityId}/{namespace}]
  </div>
  );
};
