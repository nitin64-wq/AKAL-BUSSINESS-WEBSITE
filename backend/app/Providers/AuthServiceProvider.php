<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        \App\Models\Program::class => \App\Policies\ProgramPolicy::class,
        \App\Models\Faculty::class => \App\Policies\FacultyPolicy::class,
        \App\Models\News::class => \App\Policies\NewsPolicy::class,
        \App\Models\Event::class => \App\Policies\EventPolicy::class,
        \App\Models\Testimonial::class => \App\Policies\TestimonialPolicy::class,
        \App\Models\Application::class => \App\Policies\ApplicationPolicy::class,
        \App\Models\ContactMessage::class => \App\Policies\ContactMessagePolicy::class,
        \App\Models\Placement::class => \App\Policies\PlacementPolicy::class,
        \App\Models\Scholarship::class => \App\Policies\ScholarshipPolicy::class,
        \App\Models\Gallery::class => \App\Policies\GalleryPolicy::class,
        \App\Models\Setting::class => \App\Policies\SettingPolicy::class,
        \App\Models\User::class => \App\Policies\UserPolicy::class,
        \App\Models\HeroSlide::class => \App\Policies\HeroSlidePolicy::class,
        \App\Models\StudentAchievement::class => \App\Policies\StudentAchievementPolicy::class,
        \App\Models\PartnerUniversity::class => \App\Policies\PartnerUniversityPolicy::class,
        \App\Models\Download::class => \App\Policies\DownloadPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Super-admin bypass: Admin can do everything
        Gate::before(function (\App\Models\User $user, string $ability) {
            if ($user->isAdmin()) {
                return true;
            }
        });

        // Global gates for non-model permissions
        Gate::define('export-data', function (\App\Models\User $user) {
            return $user->isAdmin() || $user->isEditor();
        });

        Gate::define('view-audit-log', function (\App\Models\User $user) {
            return $user->isAdmin();
        });
    }
}
