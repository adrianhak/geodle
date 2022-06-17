import React, { useState } from 'react';
import { X } from 'react-feather';
import Modal from 'react-modal';

interface PageProps {
  showPage: boolean;
  closePage: () => void;
  pageTitle: string;
  children: JSX.Element;
}

Modal.setAppElement('#root');

const modalStyles = {
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const Page = (props: PageProps) => {
  return (
    <Modal
      className='h-4/5 w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-neutral-100 dark:bg-neutral-900 z-50 items-center justify-center text-black dark:text-white p-2'
      style={modalStyles}
      isOpen={props.showPage}
      onRequestClose={props.closePage}
      contentLabel={props.pageTitle}
      shouldCloseOnOverlayClick={true}>
      <div className='text-center flex flex-col'>
        <div className='flex items-center justify-center'>
          <span className='text-lg font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex-1 pl-7'>
            {props.pageTitle}
          </span>
          <button onClick={props.closePage}>
            <X className='w-7 text-neutral-400 dark:text-netural-500' />
          </button>
        </div>
        {props.children}
      </div>
    </Modal>
  );
};
