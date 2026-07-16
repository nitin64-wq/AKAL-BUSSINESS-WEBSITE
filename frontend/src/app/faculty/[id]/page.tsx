import { Metadata } from 'next';
import FacultyClientPage from './FacultyClientPage';

const FALLBACK_FACULTY_NAMES: Record<string, { name: string; designation: string; department: string }> = {
  'dr-suraj-verma': { name: 'Dr. Suraj Verma', designation: 'Associate Professor & HOD', department: 'Business Analytics' },
  'dr-priyanka': { name: 'Dr. Priyanka', designation: 'Assistant Professor', department: 'Finance & Accounts' },
  'syed-owais-khursheed': { name: 'Syed Owais Khursheed', designation: 'Assistant Professor', department: 'Strategy & Marketing' },
  'dr-ayash-manzoor': { name: 'Dr. Ayash Manzoor', designation: 'Assistant Professor', department: 'Human Resources' },
  'dr-rupinder-kaur': { name: 'Dr. Rupinder Kaur', designation: 'Assistant Professor', department: 'Economics & Decisions' },
  'dr-peerzada-munaqib-naseer': { name: 'Dr. Peerzada Munaqib Naseer', designation: 'Assistant Professor', department: 'Operations & Supply Chain' },
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/faculty/${params.id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const member = json.data ?? json;
    
    return {
      title: `${member.name} | Faculty at Akal Business School`,
      description: `${member.name} is a ${member.designation} in the department of ${member.department} at Akal Business School. Specialist in ${member.specialization || 'Management'}.`,
      openGraph: {
        title: `${member.name} | Faculty Profile | Akal Business School`,
        description: `${member.name} is a ${member.designation} in the department of ${member.department} at Akal Business School.`,
      }
    };
  } catch {
    // Fall back to pre-seeded list or general info
    const fallback = FALLBACK_FACULTY_NAMES[params.id];
    if (fallback) {
      return {
        title: `${fallback.name} | Faculty at Akal Business School`,
        description: `${fallback.name} is a ${fallback.designation} in the department of ${fallback.department} at Akal Business School.`,
      };
    }
    return {
      title: 'Faculty Member Profile | Akal Business School',
      description: 'Meet our distinguished faculty members, researchers, and professors at Akal Business School.',
    };
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return <FacultyClientPage params={params} />;
}
