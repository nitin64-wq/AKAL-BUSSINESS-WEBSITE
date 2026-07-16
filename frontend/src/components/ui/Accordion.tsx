'use client';

import React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import styles from './Accordion.module.css';

interface AccordionItem {
  id: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  type = 'single',
  collapsible = true,
  defaultValue,
  className = '',
}) => {
  return (
    <RadixAccordion.Root
      type={type as 'single'}
      collapsible={collapsible}
      defaultValue={defaultValue}
      className={clsx(styles.root, className)}
    >
      {items.map((item) => (
        <RadixAccordion.Item
          key={item.id}
          value={item.id}
          className={styles.item}
        >
          <RadixAccordion.Header className={styles.header}>
            <RadixAccordion.Trigger className={styles.trigger}>
              {item.trigger}
              <ChevronDown className={styles.chevron} size={18} aria-hidden />
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className={styles.content}>
            <div className={styles.contentBody}>{item.content}</div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
};
