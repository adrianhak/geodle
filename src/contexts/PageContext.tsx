import React, { useEffect } from 'react';

const { createContext, useContext } = React;

export enum Page {
  NotSet = 'NotSet',
  Info = 'Info',
  Support = 'Support',
  Statistics = 'Statistics',
  Settings = 'Settings',
}

interface PageContextType {
  currentPage: Page;
  currentTab: number;
  setTab: (tab: number) => void;
  open: boolean;
  show: (page: Page, tab?: number) => void;
  close: () => void;
  children?: JSX.Element;
}

const initialContext = {
  currentPage: Page.NotSet,
  currentTab: 0,
  setTab: () => undefined,
  open: false,
  show: (page: Page) => undefined,
  close: () => undefined,
};

const PageContext = createContext<PageContextType>(initialContext);

export const PageContextProvider = (props: any) => {
  const [currentPage, setCurrentPage] = React.useState<Page>(Page.NotSet);
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);

  const show = (page: Page, tab?: number) => {
    if (tab) setCurrentTab(tab);
    else setCurrentTab(0);
    setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage === Page.NotSet) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [currentPage]);

  const close = () => {
    setCurrentPage(Page.NotSet);
  };

  const setTab = (tab: number) => {
    setCurrentTab(tab);
  };

  return (
    <PageContext.Provider value={{ currentPage, currentTab, setTab, open, show, close }}>
      {props.children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  return useContext(PageContext);
};
