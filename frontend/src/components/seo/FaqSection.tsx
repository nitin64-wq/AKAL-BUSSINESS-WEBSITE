/* ============================================================
   ABS — FAQ Accordion Component
   Interactive accordion UI list with semantic details for SEO.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import styles from './FaqSection.module.css';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  title?: string;
}

export function FaqSection({ faqs, title = 'Frequently Asked Questions' }: FaqSectionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleOpen = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className={styles.faqContainer} aria-label="FAQ Section">
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.accordionList}>
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className={isOpen ? styles.itemActive : styles.item}
              style={{ contentVisibility: 'auto' }}
            >
              <h3>
                <button
                  className={styles.header}
                  onClick={() => toggleOpen(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-question-${faq.id}`}
                >
                  <span className={styles.question}>{faq.question}</span>
                  <span className={styles.iconWrapper}>
                    <ChevronDown size={18} />
                  </span>
                </button>
              </h3>

              <div
                id={`faq-answer-${faq.id}`}
                className={styles.contentWrapper}
                style={{
                  maxHeight: isOpen ? '1000px' : '0',
                  transition: 'max-height 0.25s ease-in-out',
                }}
                aria-labelledby={`faq-question-${faq.id}`}
                role="region"
              >
                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
