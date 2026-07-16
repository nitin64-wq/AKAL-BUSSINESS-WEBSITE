/* ============================================================
   ABS — RichEditor Component
   Custom premium Markdown editor with a live HTML preview tab.
   Avoids heavy node packages, providing clean, custom formatting controls.
   ============================================================ */

'use client';

import React, { useState } from 'react';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  error?: string;
}

export function RichEditor({
  value,
  onChange,
  placeholder = 'Write content here...',
  rows = 10,
  label,
  error,
}: RichEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Simple Markdown to HTML parser
  const parseMarkdownToHtml = (md: string): string => {
    if (!md) return '';
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic (*text*)
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Headings (## Heading)
    html = html.replace(/^## (.*?)$/gm, '<h3 style="color:var(--color-gold);margin-top:1.5rem;margin-bottom:0.5rem;font-family:var(--font-display)">$1</h3>');
    html = html.replace(/^### (.*?)$/gm, '<h4 style="color:var(--color-white);margin-top:1.2rem;margin-bottom:0.4rem;font-family:var(--font-display)">$1</h4>');

    // Blockquotes (> text)
    html = html.replace(/^&gt; (.*?)$/gm, '<blockquote style="border-left:3px solid var(--color-gold);padding-left:1rem;color:var(--color-muted);margin:1rem 0;font-style:italic">$1</blockquote>');

    // Bullet lists (- item)
    // Wrap bullet lines in <li>
    html = html.replace(/^- (.*?)$/gm, '<li style="margin-left:1.5rem;list-style-type:disc;margin-bottom:0.25rem">$1</li>');

    // Links ([text](url))
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--color-gold);text-decoration:underline">$1</a>');

    // Paragraphs (double newlines)
    html = html.split(/\n\n+/).map(p => {
      // If paragraph contains block level elements, do not wrap in <p>
      if (p.trim().startsWith('<h') || p.trim().startsWith('<blockquote') || p.trim().startsWith('<li')) {
        return p;
      }
      return `<p style="margin-bottom:1rem;line-height:var(--leading-relaxed)">${p.replace(/\n/g, '<br />')}</p>`;
    }).join('');

    return html;
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    onChange(text.substring(0, start) + replacement + text.substring(end));

    // Refocus and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const previewHtml = parseMarkdownToHtml(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {label && (
        <label style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-white)' }}>
          {label}
        </label>
      )}

      <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--color-navy-mid)' }}>
        {/* Editor Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-navy-light)' }}>
          {/* Action buttons (only active in edit tab) */}
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <button
              type="button"
              disabled={activeTab === 'preview'}
              onClick={() => insertText('**', '**')}
              style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', fontWeight: 'bold', borderRadius: '4px', border: '1px solid var(--color-border)', color: activeTab === 'preview' ? 'var(--color-muted)' : 'var(--color-white)' }}
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              disabled={activeTab === 'preview'}
              onClick={() => insertText('*', '*')}
              style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', fontStyle: 'italic', borderRadius: '4px', border: '1px solid var(--color-border)', color: activeTab === 'preview' ? 'var(--color-muted)' : 'var(--color-white)' }}
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              disabled={activeTab === 'preview'}
              onClick={() => insertText('## ')}
              style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', borderRadius: '4px', border: '1px solid var(--color-border)', color: activeTab === 'preview' ? 'var(--color-muted)' : 'var(--color-white)' }}
              title="Header"
            >
              H2
            </button>
            <button
              type="button"
              disabled={activeTab === 'preview'}
              onClick={() => insertText('- ')}
              style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', borderRadius: '4px', border: '1px solid var(--color-border)', color: activeTab === 'preview' ? 'var(--color-muted)' : 'var(--color-white)' }}
              title="Bullet List"
            >
              • List
            </button>
            <button
              type="button"
              disabled={activeTab === 'preview'}
              onClick={() => insertText('[Link Title](', ')')}
              style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', borderRadius: '4px', border: '1px solid var(--color-border)', color: activeTab === 'preview' ? 'var(--color-muted)' : 'var(--color-white)' }}
              title="Add Link"
            >
              Link
            </button>
            <button
              type="button"
              disabled={activeTab === 'preview'}
              onClick={() => insertText('> ')}
              style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', borderRadius: '4px', border: '1px solid var(--color-border)', color: activeTab === 'preview' ? 'var(--color-muted)' : 'var(--color-white)' }}
              title="Quote block"
            >
              &ldquo; Quote
            </button>
          </div>

          {/* Edit / Preview Tabs */}
          <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              style={{
                padding: '4px var(--space-3)',
                fontSize: '11px',
                fontWeight: 'bold',
                backgroundColor: activeTab === 'edit' ? 'var(--color-gold)' : 'transparent',
                color: activeTab === 'edit' ? 'var(--color-navy)' : 'var(--color-muted)',
              }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '4px var(--space-3)',
                fontSize: '11px',
                fontWeight: 'bold',
                backgroundColor: activeTab === 'preview' ? 'var(--color-gold)' : 'transparent',
                color: activeTab === 'preview' ? 'var(--color-navy)' : 'var(--color-muted)',
              }}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Workspace panel */}
        <div>
          {activeTab === 'edit' ? (
            <textarea
              id="markdown-textarea"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={rows}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--color-white)',
                padding: 'var(--space-4)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-relaxed)',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: previewHtml || '<p style="color:var(--color-muted);font-style:italic">Nothing to preview yet.</p>' }}
              style={{
                padding: 'var(--space-4)',
                minHeight: `${rows * 20}px`,
                backgroundColor: 'transparent',
                color: 'var(--color-off-white)',
                overflowY: 'auto',
              }}
            />
          )}
        </div>
      </div>

      {error && <span style={{ color: 'var(--color-error)', fontSize: '11px', fontWeight: 'bold' }}>{error}</span>}
    </div>
  );
}
