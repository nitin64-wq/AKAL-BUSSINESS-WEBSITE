/* ============================================================
   ABS — API Response Types
   Standard API response wrappers and pagination types.
   ============================================================ */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: import('./models').User;
  token: string;
}

export interface ApplicationFormData {
  program_id: number;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  last_qualification: string;
  marks_percentage: number;
  entrance_exam?: string;
  entrance_score?: string;
  work_experience?: number;
  category?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source?: 'Contact' | 'Enquiry' | 'Brochure' | 'Callback';
}

export interface NewsletterFormData {
  email: string;
}

export interface SettingsUpdateData {
  [key: string]: string | number | boolean;
}

export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  category?: string;
  type?: string;
  status?: string;
  is_featured?: boolean;
  is_active?: boolean;
  year?: number;
}
