'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmContext.module.css';

interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

type ConfirmFunction = (message: string, options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFunction | null>(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Are you sure?');
  const [confirmText, setConfirmText] = useState('Confirm');
  const [cancelText, setCancelText] = useState('Cancel');
  const [variant, setVariant] = useState<'danger' | 'warning' | 'info'>('danger');
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((msg: string, options: ConfirmOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setMessage(msg);
      setTitle(options.title || 'Are you sure?');
      setConfirmText(options.confirmText || 'Confirm');
      setCancelText(options.cancelText || 'Cancel');
      setVariant(options.variant || 'danger');
      setResolver(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleCancel = () => {
    if (resolver) resolver(false);
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (resolver) resolver(true);
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.content}>
            <div className={styles.dialogHeader}>
              <div className={`${styles.iconContainer} ${styles[variant]}`}>
                <AlertTriangle size={24} />
              </div>
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            </div>
            
            <Dialog.Description className={styles.description}>
              {message}
            </Dialog.Description>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                {cancelText}
              </button>
              <button
                type="button"
                className={`${styles.confirmBtn} ${styles[`confirmBtn_${variant}`]}`}
                onClick={handleConfirm}
                autoFocus
              >
                {confirmText}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ConfirmContext.Provider>
  );
};
