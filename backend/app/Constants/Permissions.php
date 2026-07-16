<?php

namespace App\Constants;

class Permissions
{
    // Content Management Permissions
    const PROGRAMS_VIEW           = 'programs.view';
    const PROGRAMS_CREATE         = 'programs.create';
    const PROGRAMS_EDIT           = 'programs.edit';
    const PROGRAMS_DELETE         = 'programs.delete';
    const PROGRAMS_TOGGLE_ACTIVE  = 'programs.toggle_active';

    const FACULTY_VIEW            = 'faculty.view';
    const FACULTY_CREATE          = 'faculty.create';
    const FACULTY_EDIT            = 'faculty.edit';
    const FACULTY_DELETE          = 'faculty.delete';
    const FACULTY_REORDER         = 'faculty.reorder';

    const NEWS_VIEW               = 'news.view';
    const NEWS_CREATE             = 'news.create';
    const NEWS_EDIT_OWN           = 'news.edit_own';
    const NEWS_EDIT_ANY           = 'news.edit_any';
    const NEWS_DELETE             = 'news.delete';
    const NEWS_PUBLISH            = 'news.publish';
    const NEWS_FEATURE            = 'news.feature';

    const EVENTS_VIEW             = 'events.view';
    const EVENTS_CREATE           = 'events.create';
    const EVENTS_EDIT             = 'events.edit';
    const EVENTS_DELETE           = 'events.delete';

    const TESTIMONIALS_VIEW       = 'testimonials.view';
    const TESTIMONIALS_MANAGE     = 'testimonials.manage';
    const TESTIMONIALS_DELETE     = 'testimonials.delete';

    const GALLERY_VIEW            = 'gallery.view';
    const GALLERY_UPLOAD          = 'gallery.upload';
    const GALLERY_DELETE          = 'gallery.delete';

    const SCHOLARSHIPS_VIEW       = 'scholarships.view';
    const SCHOLARSHIPS_MANAGE     = 'scholarships.manage';
    const SCHOLARSHIPS_DELETE     = 'scholarships.delete';

    // Application & Communication Permissions
    const APPLICATIONS_VIEW_LIST   = 'applications.view_list';
    const APPLICATIONS_VIEW_DETAIL = 'applications.view_detail';
    const APPLICATIONS_UPDATE_STATUS= 'applications.update_status';
    const APPLICATIONS_ADD_REMARKS = 'applications.add_remarks';
    const APPLICATIONS_DELETE      = 'applications.delete';
    const APPLICATIONS_EXPORT_CSV  = 'applications.export_csv';
    const APPLICATIONS_EXPORT_PDF  = 'applications.export_pdf';

    const MESSAGES_VIEW            = 'messages.view';
    const MESSAGES_MARK_READ       = 'messages.mark_read';
    const MESSAGES_REPLY           = 'messages.reply';
    const MESSAGES_DELETE          = 'messages.delete';

    // System Administration Permissions
    const DASHBOARD_VIEW_FULL      = 'dashboard.view_full';
    const DASHBOARD_VIEW_LIMITED   = 'dashboard.view_limited';
    
    const SETTINGS_VIEW            = 'settings.view';
    const SETTINGS_EDIT            = 'settings.edit';
    
    const USERS_VIEW               = 'users.view';
    const USERS_CREATE             = 'users.create';
    const USERS_EDIT               = 'users.edit';
    const USERS_DELETE             = 'users.delete';
    const USERS_CHANGE_ROLE        = 'users.change_role';
    
    const FILES_UPLOAD             = 'files.upload';
    const FILES_DELETE             = 'files.delete';
    
    const AUDIT_LOG_VIEW           = 'audit_log.view';
    
    const PLACEMENTS_MANAGE        = 'placements.manage';
    const PLACEMENTS_DELETE        = 'placements.delete';

    /**
     * Get all permissions
     */
    public static function allPermissions(): array
    {
        return [
            self::PROGRAMS_VIEW, self::PROGRAMS_CREATE, self::PROGRAMS_EDIT, self::PROGRAMS_DELETE, self::PROGRAMS_TOGGLE_ACTIVE,
            self::FACULTY_VIEW, self::FACULTY_CREATE, self::FACULTY_EDIT, self::FACULTY_DELETE, self::FACULTY_REORDER,
            self::NEWS_VIEW, self::NEWS_CREATE, self::NEWS_EDIT_OWN, self::NEWS_EDIT_ANY, self::NEWS_DELETE, self::NEWS_PUBLISH, self::NEWS_FEATURE,
            self::EVENTS_VIEW, self::EVENTS_CREATE, self::EVENTS_EDIT, self::EVENTS_DELETE,
            self::TESTIMONIALS_VIEW, self::TESTIMONIALS_MANAGE, self::TESTIMONIALS_DELETE,
            self::GALLERY_VIEW, self::GALLERY_UPLOAD, self::GALLERY_DELETE,
            self::SCHOLARSHIPS_VIEW, self::SCHOLARSHIPS_MANAGE, self::SCHOLARSHIPS_DELETE,
            self::APPLICATIONS_VIEW_LIST, self::APPLICATIONS_VIEW_DETAIL, self::APPLICATIONS_UPDATE_STATUS, self::APPLICATIONS_ADD_REMARKS, self::APPLICATIONS_DELETE, self::APPLICATIONS_EXPORT_CSV, self::APPLICATIONS_EXPORT_PDF,
            self::MESSAGES_VIEW, self::MESSAGES_MARK_READ, self::MESSAGES_REPLY, self::MESSAGES_DELETE,
            self::DASHBOARD_VIEW_FULL, self::DASHBOARD_VIEW_LIMITED,
            self::SETTINGS_VIEW, self::SETTINGS_EDIT,
            self::USERS_VIEW, self::USERS_CREATE, self::USERS_EDIT, self::USERS_DELETE, self::USERS_CHANGE_ROLE,
            self::FILES_UPLOAD, self::FILES_DELETE,
            self::AUDIT_LOG_VIEW,
            self::PLACEMENTS_MANAGE, self::PLACEMENTS_DELETE
        ];
    }

    /**
     * Permissions for Editor role
     */
    public static function editorPermissions(): array
    {
        return [
            self::PROGRAMS_VIEW, self::PROGRAMS_CREATE, self::PROGRAMS_EDIT, self::PROGRAMS_TOGGLE_ACTIVE,
            self::FACULTY_VIEW, self::FACULTY_CREATE, self::FACULTY_EDIT, self::FACULTY_REORDER,
            self::NEWS_VIEW, self::NEWS_CREATE, self::NEWS_EDIT_OWN, self::NEWS_PUBLISH, self::NEWS_FEATURE,
            self::EVENTS_VIEW, self::EVENTS_CREATE, self::EVENTS_EDIT,
            self::TESTIMONIALS_VIEW, self::TESTIMONIALS_MANAGE,
            self::GALLERY_VIEW, self::GALLERY_UPLOAD,
            self::SCHOLARSHIPS_VIEW, self::SCHOLARSHIPS_MANAGE,
            self::APPLICATIONS_VIEW_LIST, self::APPLICATIONS_VIEW_DETAIL, self::APPLICATIONS_UPDATE_STATUS, self::APPLICATIONS_ADD_REMARKS, self::APPLICATIONS_EXPORT_CSV, self::APPLICATIONS_EXPORT_PDF,
            self::MESSAGES_VIEW, self::MESSAGES_MARK_READ, self::MESSAGES_REPLY,
            self::DASHBOARD_VIEW_LIMITED,
            self::FILES_UPLOAD,
            self::PLACEMENTS_MANAGE
        ];
    }

    /**
     * Permissions for Viewer role
     */
    public static function viewerPermissions(): array
    {
        return [
            self::PROGRAMS_VIEW,
            self::FACULTY_VIEW,
            self::NEWS_VIEW,
            self::EVENTS_VIEW,
            self::TESTIMONIALS_VIEW,
            self::GALLERY_VIEW,
            self::SCHOLARSHIPS_VIEW,
            self::APPLICATIONS_VIEW_LIST, self::APPLICATIONS_VIEW_DETAIL,
            self::MESSAGES_VIEW,
            self::DASHBOARD_VIEW_LIMITED
        ];
    }

    /**
     * Map a role to its array of permissions
     */
    public static function forRole(string $role): array
    {
        return match ($role) {
            'admin' => self::allPermissions(),
            'editor' => self::editorPermissions(),
            'viewer' => self::viewerPermissions(),
            default => [],
        };
    }
}
