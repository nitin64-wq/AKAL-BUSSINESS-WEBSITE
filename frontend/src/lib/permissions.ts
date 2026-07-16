/* ============================================================
   ABS — Role-Based Access Control (RBAC) Permissions Helper
   Defines user roles hierarchy and front-end permission matrix.
   ============================================================ */

export type UserRole = 'admin' | 'editor' | 'viewer';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  editor: 2,
  viewer: 1,
};

/**
 * Checks if user's role meets the minimum required role hierarchy.
 */
export function hasMinRole(userRole: UserRole, minRole: UserRole): boolean {
  const userScore = ROLE_HIERARCHY[userRole] || 0;
  const minScore = ROLE_HIERARCHY[minRole] || 0;
  return userScore >= minScore;
}

/**
 * Evaluates whether a role is authorized for a specific action/permission key.
 * This aligns with the backend Laravel Policies and Route Middlewares.
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  // Super-user bypass: admin has full access to all keys
  if (role === 'admin') return true;

  // Editor (Content & Operations manager) permissions
  if (role === 'editor') {
    const editorPermissions = [
      // Programs
      'programs.view',
      'programs.create',
      'programs.edit',
      'programs.toggle_active',

      // Faculty
      'faculty.view',
      'faculty.create',
      'faculty.edit',
      'faculty.reorder',

      // News & Events
      'news.view',
      'news.create',
      'news.edit',
      'news.publish',
      'news.feature',
      'events.view',
      'events.create',
      'events.edit',

      // Other contents
      'testimonials.view',
      'testimonials.manage',
      'placements.manage',
      'scholarships.view',
      'scholarships.manage',
      'gallery.view',
      'gallery.upload',
      'files.upload',

      // Operations (Applications & Contact inquiries)
      'applications.view_list',
      'applications.view_detail',
      'applications.update_status',
      'applications.add_remarks',
      'applications.export_csv',
      'applications.export_pdf',
      'messages.view',
      'messages.mark_read',
      'messages.reply',
    ];
    return editorPermissions.includes(permission);
  }

  // Viewer (Read-only staff) permissions
  if (role === 'viewer') {
    const viewerPermissions = [
      'programs.view',
      'faculty.view',
      'news.view',
      'events.view',
      'testimonials.view',
      'scholarships.view',
      'gallery.view',
      'applications.view_list',
      'applications.view_detail',
      'messages.view',
    ];
    return viewerPermissions.includes(permission);
  }

  return false;
}
