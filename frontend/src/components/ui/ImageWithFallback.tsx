
'use client';

import React, { useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { getImageUrl } from '@/lib/utils';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = '/images/placeholder.jpg',
  alt,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    return src ? getImageUrl(src) : fallbackSrc;
  });

  useEffect(() => {
    if (src) {
      setImgSrc(getImageUrl(src));
    } else {
      setImgSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  return (
    <Image
      src={imgSrc}
      alt={alt || 'Image'}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      {...props}
    />
  );
};
