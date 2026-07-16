/* ============================================================
   ABS — FileUpload Component
   Handles drag & drop and traditional file picking with preview capabilities.
   ============================================================ */

'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  error?: string;
  currentFileUrl?: string;
  labelColor?: string;
}

export function FileUpload({
  onChange,
  accept = 'image/*',
  maxSizeMB = 5,
  label,
  error,
  currentFileUrl,
  labelColor,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds the ${maxSizeMB}MB limit.`);
      return;
    }

    setSelectedFile(file);
    onChange(file);

    // Create image preview if image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null); // Clear preview for documents
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = accept.includes('image/') || (selectedFile && selectedFile.type.startsWith('image/')) || (previewUrl && !selectedFile);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {label && (
        <label style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: labelColor || 'var(--color-white)' }}>
          {label}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-6)',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragActive ? 'rgba(201, 168, 76, 0.05)' : 'var(--color-navy-mid)',
          borderColor: dragActive ? 'var(--color-gold)' : 'var(--color-border)',
          transition: 'var(--transition-fast)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '140px'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Selected file preview */}
        {previewUrl && isImage ? (
          <div style={{ position: 'relative', width: '100%', maxWidth: '200px', height: '100px' }} onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="File preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            />
            <button
              type="button"
              onClick={handleClear}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'var(--color-error)',
                color: 'var(--color-white)',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <X size={12} />
            </button>
          </div>
        ) : selectedFile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-gold-light)', padding: 'var(--space-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-navy-light)' }} onClick={(e) => e.stopPropagation()}>
            <File size={16} />
            <span style={{ fontSize: 'var(--text-xs)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedFile.name}
            </span>
            <button type="button" onClick={handleClear} style={{ color: 'var(--color-error)', background: 'none', border: 'none', marginLeft: 'var(--space-1)' }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={24} style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-2)' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-white)', fontWeight: 'var(--font-semibold)' }}>
              Drag & Drop file here
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: 'var(--space-1)' }}>
              or click to browse. Max size: {maxSizeMB}MB
            </span>
          </>
        )}
      </div>

      {error && <span style={{ color: 'var(--color-error)', fontSize: '11px', fontWeight: 'bold' }}>{error}</span>}
    </div>
  );
}
