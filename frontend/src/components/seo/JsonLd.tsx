/* ============================================================
   ABS — JSON-LD Structured Data Injector
   Injects structured schema JSON into the page head.
   ============================================================ */

import React from 'react';

interface JsonLdProps {
  schema: Record<string, any> | Array<Record<string, any>> | null;
}

export function JsonLd({ schema }: JsonLdProps) {
  if (!schema) return null;

  const jsonString = JSON.stringify(schema);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
