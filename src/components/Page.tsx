import { Transition } from '@headlessui/react';
import React from 'react';
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
    background: 'rgba(0, 0, 0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const Page = (props: PageProps) => {
  return (
    <Modal
      className='h-5/6 w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 z-50 items-center justify-center text-black dark:text-white'
      style={modalStyles}
      isOpen={props.showPage}
      onRequestClose={props.closePage}
      contentLabel={props.pageTitle}
      shouldCloseOnOverlayClick={true}>
      <Transition
        className='bg-neutral-100 dark:bg-black w-full h-full p-2 border border-neutral-400 flex flex-col'
        as='div'
        appear={true} //THIS will make the transition run everytime the component is rendered
        show={props.showPage}
        enter='transition-all duration-200 ease-out'
        enterFrom='transform translate-y-12 opacity-50'
        enterTo='transform translate-y-0 opacity-100'>
        <div className='flex items-center justify-center'>
          <span className='text-lg font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-300 flex-1 pl-7 text-center'>
            {props.pageTitle}
          </span>
          <button onClick={props.closePage}>
            <X className='w-7 text-neutral-400 dark:text-netural-300' />
          </button>
        </div>
        {props.children}
      </Transition>
    </Modal>
  );
};
