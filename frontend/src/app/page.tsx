import React from 'react';
import { HomeClient } from '@/components/home/HomeClient';

export const metadata = {
  title: 'Home | Akal Business School (ABS)',
  description: 'Welcome to Akal Business School. Discover our flagship MBA in AI & Business Analytics, BBA (Business Analytics), and PhD programs with outstanding placements and international MoUs.',
};

export default function Home() {
  return <HomeClient />;
}
