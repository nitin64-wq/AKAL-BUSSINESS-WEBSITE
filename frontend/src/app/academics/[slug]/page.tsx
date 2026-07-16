import { Metadata } from 'next';
import ProgramClientPage from './ProgramClientPage';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/programs/${params.slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const program = json.data ?? json;
    
    return {
      title: `${program.title} | Akal Business School`,
      description: program.description || `Read about the ${program.title} degree program at Akal Business School.`,
      openGraph: {
        title: `${program.title} | Akal Business School`,
        description: program.description || `Read about the ${program.title} degree program at Akal Business School.`,
      }
    };
  } catch {
    return {
      title: 'Academic Program Details | Akal Business School',
      description: 'Explore our premium academic programs in Business Analytics and management.',
    };
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ProgramClientPage params={params} />;
}
