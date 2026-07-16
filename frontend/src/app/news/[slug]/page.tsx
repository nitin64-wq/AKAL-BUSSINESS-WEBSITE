import { Metadata } from 'next';
import NewsClientPage from './NewsClientPage';

const FALLBACK_NEWS_TITLES: Record<string, { title: string; excerpt: string }> = {
  'international-conference-gen-ai-analytics': {
    title: 'ABS Hosts International Conference on Generative AI in Business Analytics',
    excerpt: 'The three-day conference featured keynotes from distinguished global partners and panel discussions on AI-driven financial models.'
  },
  'dr-suraj-verma-appointed-hod-business-analytics': {
    title: 'Dr. Suraj Verma Appointed Associate Professor & HOD of Business Analytics',
    excerpt: 'Dr. Suraj Verma joins ABS to lead our state-of-the-art Business Analytics program, bringing over 12 years of core industry and research consulting expertise.'
  },
  'record-placements-drive-2026': {
    title: 'Akal Business School Achieves Record 95% Placement in 2026 Drive',
    excerpt: 'Our students secure premium placements in top corporations including KPMG, Deloitte, EY, PwC, and HDFC Bank with packages scaling up to ₹12 LPA.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/news/${params.slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const article = json.data ?? json;
    
    return {
      title: `${article.title} | Akal Business School`,
      description: article.excerpt || `Read the latest news and campus events from Akal Business School: ${article.title}.`,
      openGraph: {
        title: `${article.title} | News & Events | Akal Business School`,
        description: article.excerpt || `Read the latest news and campus events from Akal Business School.`,
      }
    };
  } catch {
    const fallback = FALLBACK_NEWS_TITLES[params.slug];
    if (fallback) {
      return {
        title: `${fallback.title} | Akal Business School`,
        description: fallback.excerpt,
      };
    }
    return {
      title: 'ABS News Publications | Akal Business School',
      description: 'Stay updated with global academic partnerships, campus milestones, and career placement bulletins at Akal Business School.',
    };
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  return <NewsClientPage params={params} />;
}
