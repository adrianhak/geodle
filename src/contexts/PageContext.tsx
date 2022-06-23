import React from 'react';

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
  open: boolean;
  show: (page: Page) => void;
  close: () => void;
  children?: JSX.Element;
}

const initialContext = {
  currentPage: Page.NotSet,
  open: false,
  show: (page: Page) => undefined,
  close: () => undefined,
};

const PageContext = createContext<PageContextType>(initialContext);

export const PageContextProvider = (props: any) => {
  const [currentPage, setCurrentPage] = React.useState(Page.Info);
  const [open, setOpen] = React.useState(false);

  const show = (page: Page) => {
    setCurrentPage(page);
    setOpen(true);
  };
  const close = () => setOpen(false);
  return (
    <PageContext.Provider value={{ currentPage, open, show, close }}>
      {props.children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  return useContext(PageContext);
};
