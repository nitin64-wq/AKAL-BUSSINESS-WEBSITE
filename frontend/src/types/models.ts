/* ============================================================
   ABS — TypeScript Model Interfaces
   Matches the Laravel backend database schema exactly.
   ============================================================ */

export interface Program {
  id: number;
  title: string;
  slug: string;
  type: 'MBA' | 'BBA' | 'IMP' | 'Executive' | 'Doctoral' | 'Certificate';
  duration: string;
  description: string;
  highlights: string[];
  eligibility: string | null;
  fee_per_year: number | null;
  seats: number;
  cover_image: string | null;
  brochure_url: string | null;
  is_active: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Faculty {
  id: number;
  name: string;
  slug: string;
  designation: string;
  department: string;
  specialization: string | null;
  qualification: string | null;
  experience_years: number;
  bio: string | null;
  photo: string | null;
  email: string | null;
  linkedin_url: string | null;
  google_scholar: string | null;
  publications: number;
  is_distinguished: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  category: 'Industry Talk' | 'International Conference' | 'Placement Drive' | 'Scholarship' | 'Research' | 'Campus News';
  author_id: number | null;
  author?: User;
  published_at: string | null;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  event_date: string;
  event_time: string | null;
  venue: string | null;
  cover_image: string | null;
  registration_url: string | null;
  is_upcoming: boolean;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string | null;
  photo: string | null;
  quote: string;
  rating: number;
  batch_year: number | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  application_no: string;
  program_id: number;
  program?: Program;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  last_qualification: string | null;
  marks_percentage: number | null;
  entrance_exam: string | null;
  entrance_score: string | null;
  work_experience: number;
  category: 'General' | 'SC' | 'ST' | 'OBC' | 'EWS' | 'PWD';
  status: 'Pending' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Rejected' | 'Waitlist';
  documents: Record<string, string> | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: 'Contact' | 'Enquiry' | 'Brochure' | 'Callback';
  is_read: boolean;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Placement {
  id: number;
  company_name: string;
  company_logo: string | null;
  role_offered: string | null;
  package_lpa: number | null;
  year: number;
  placement_type: 'Campus' | 'Internship' | 'PPO';
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Scholarship {
  id: number;
  title: string;
  type: 'Merit' | 'Need-Based' | 'Sports' | 'Research' | 'International';
  description: string;
  eligibility: string | null;
  amount_percent: number | null;
  max_amount: number | null;
  application_deadline: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  thumbnail_url: string | null;
  category: 'Campus' | 'Events' | 'Faculty' | 'Placements' | 'Sports' | 'Cultural' | 'Conferences' | 'Labs';
  alt_text: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string | null;
  type: 'text' | 'number' | 'boolean' | 'json' | 'image';
  group: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  user_id: number | null;
  user?: User;
  action: 'create' | 'update' | 'delete' | 'login' | 'status_change';
  model_type: string | null;
  model_id: number | null;
  changes: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface StatsSummary {
  placement_rate: number;
  highest_package: number;
  average_package: number;
  alumni_count: number;
  corporate_recruiters: number;
  international_partners: number;
  faculty_count: number;
}

export interface DashboardStats {
  total_applications: number;
  pending_applications: number;
  new_messages: number;
  published_news: number;
  recent_applications: Application[];
}
