<?php

namespace Database\Seeders;

use App\Models\SeoSetting;
use Illuminate\Database\Seeder;

class SeoSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // ── General ─────────────────────────────────────
            ['key' => 'website_name', 'value' => 'Akal Business School', 'type' => 'text', 'group' => 'general', 'label' => 'Website Name', 'description' => 'The name of the website', 'sort_order' => 1],
            ['key' => 'website_title', 'value' => 'Akal Business School (ABS) | Premium Management Education', 'type' => 'text', 'group' => 'general', 'label' => 'Website Title', 'description' => 'Default browser tab title', 'sort_order' => 2],
            ['key' => 'default_meta_title', 'value' => 'Akal Business School (ABS) | Premium Management Education', 'type' => 'text', 'group' => 'general', 'label' => 'Default Meta Title', 'description' => 'Fallback SEO title', 'sort_order' => 3],
            ['key' => 'default_meta_description', 'value' => 'Akal Business School (ABS) offers premium MBA, BBA, and PhD programs in Business Analytics, AI, and Management. Transform your future with international MoUs, placement records, and distinguished faculty.', 'type' => 'textarea', 'group' => 'general', 'label' => 'Default Meta Description', 'description' => 'Fallback meta description', 'sort_order' => 4],
            ['key' => 'default_keywords', 'value' => 'MBA, BBA, PhD, Akal Business School, ABS, Management, Business Analytics, AI, Placements, Punjab', 'type' => 'textarea', 'group' => 'general', 'label' => 'Default Keywords', 'description' => 'Comma-separated default keywords', 'sort_order' => 5],
            ['key' => 'website_logo', 'value' => '', 'type' => 'image', 'group' => 'general', 'label' => 'Website Logo', 'description' => 'Main website logo', 'sort_order' => 6],
            ['key' => 'favicon', 'value' => '', 'type' => 'image', 'group' => 'general', 'label' => 'Favicon', 'description' => 'Browser tab icon', 'sort_order' => 7],
            ['key' => 'default_canonical_url', 'value' => 'https://business.auts.ac.in', 'type' => 'text', 'group' => 'general', 'label' => 'Default Canonical URL', 'description' => 'Base canonical URL', 'sort_order' => 8],

            // ── Organization ────────────────────────────────
            ['key' => 'organization_name', 'value' => 'Akal Business School', 'type' => 'text', 'group' => 'organization', 'label' => 'Organization Name', 'description' => 'Legal organization name', 'sort_order' => 1],
            ['key' => 'organization_logo', 'value' => '', 'type' => 'image', 'group' => 'organization', 'label' => 'Organization Logo', 'description' => 'Schema.org organization logo', 'sort_order' => 2],
            ['key' => 'business_type', 'value' => 'EducationalOrganization', 'type' => 'text', 'group' => 'organization', 'label' => 'Business Type', 'description' => 'Schema.org business type', 'sort_order' => 3],
            ['key' => 'contact_email', 'value' => 'director_abs@auts.ac.in', 'type' => 'text', 'group' => 'organization', 'label' => 'Contact Email', 'description' => 'Primary contact email', 'sort_order' => 4],
            ['key' => 'contact_phone', 'value' => '', 'type' => 'text', 'group' => 'organization', 'label' => 'Contact Phone', 'description' => 'Primary contact phone', 'sort_order' => 5],
            ['key' => 'contact_address', 'value' => '', 'type' => 'textarea', 'group' => 'organization', 'label' => 'Contact Address', 'description' => 'Physical address', 'sort_order' => 6],

            // ── Social Links ────────────────────────────────
            ['key' => 'social_facebook', 'value' => 'https://www.facebook.com/AkalBusinessSchool', 'type' => 'text', 'group' => 'social', 'label' => 'Facebook URL', 'description' => '', 'sort_order' => 1],
            ['key' => 'social_instagram', 'value' => 'https://www.instagram.com/akalbusinessschool', 'type' => 'text', 'group' => 'social', 'label' => 'Instagram URL', 'description' => '', 'sort_order' => 2],
            ['key' => 'social_linkedin', 'value' => 'https://www.linkedin.com/school/akal-business-school', 'type' => 'text', 'group' => 'social', 'label' => 'LinkedIn URL', 'description' => '', 'sort_order' => 3],
            ['key' => 'social_youtube', 'value' => 'https://www.youtube.com/AkalBusinessSchool', 'type' => 'text', 'group' => 'social', 'label' => 'YouTube URL', 'description' => '', 'sort_order' => 4],
            ['key' => 'social_twitter', 'value' => '', 'type' => 'text', 'group' => 'social', 'label' => 'Twitter/X URL', 'description' => '', 'sort_order' => 5],

            // ── Analytics & Tracking ────────────────────────
            ['key' => 'google_analytics_id', 'value' => '', 'type' => 'text', 'group' => 'analytics', 'label' => 'Google Analytics ID', 'description' => 'e.g. G-XXXXXXXXXX', 'sort_order' => 1],
            ['key' => 'google_tag_manager_id', 'value' => '', 'type' => 'text', 'group' => 'analytics', 'label' => 'Google Tag Manager ID', 'description' => 'e.g. GTM-XXXXXXX', 'sort_order' => 2],
            ['key' => 'facebook_pixel_id', 'value' => '', 'type' => 'text', 'group' => 'analytics', 'label' => 'Facebook Pixel ID', 'description' => 'Meta Pixel tracking ID', 'sort_order' => 3],
            ['key' => 'indexnow_api_key', 'value' => '', 'type' => 'text', 'group' => 'analytics', 'label' => 'IndexNow API Key', 'description' => 'For instant indexing', 'sort_order' => 4],

            // ── Verification ────────────────────────────────
            ['key' => 'google_verification', 'value' => '', 'type' => 'text', 'group' => 'verification', 'label' => 'Google Search Console Verification', 'description' => 'Content value of google-site-verification meta tag', 'sort_order' => 1],
            ['key' => 'bing_verification', 'value' => '', 'type' => 'text', 'group' => 'verification', 'label' => 'Bing Verification', 'description' => 'Content value of msvalidate.01 meta tag', 'sort_order' => 2],
            ['key' => 'yandex_verification', 'value' => '', 'type' => 'text', 'group' => 'verification', 'label' => 'Yandex Verification', 'description' => 'Content value of yandex-verification meta tag', 'sort_order' => 3],
            ['key' => 'baidu_verification', 'value' => '', 'type' => 'text', 'group' => 'verification', 'label' => 'Baidu Verification', 'description' => 'Content value of baidu-site-verification meta tag', 'sort_order' => 4],

            // ── Open Graph Defaults ─────────────────────────
            ['key' => 'default_og_image', 'value' => '', 'type' => 'image', 'group' => 'opengraph', 'label' => 'Default OG Image', 'description' => 'Fallback Open Graph image (1200x630)', 'sort_order' => 1],
            ['key' => 'og_site_name', 'value' => 'Akal Business School', 'type' => 'text', 'group' => 'opengraph', 'label' => 'OG Site Name', 'description' => '', 'sort_order' => 2],
            ['key' => 'og_locale', 'value' => 'en_US', 'type' => 'text', 'group' => 'opengraph', 'label' => 'OG Locale', 'description' => '', 'sort_order' => 3],

            // ── Twitter Card Defaults ───────────────────────
            ['key' => 'twitter_card_type', 'value' => 'summary_large_image', 'type' => 'text', 'group' => 'twitter', 'label' => 'Twitter Card Type', 'description' => 'summary or summary_large_image', 'sort_order' => 1],
            ['key' => 'twitter_site', 'value' => '', 'type' => 'text', 'group' => 'twitter', 'label' => 'Twitter Site Handle', 'description' => 'e.g. @AkalBusiness', 'sort_order' => 2],
            ['key' => 'twitter_creator', 'value' => '', 'type' => 'text', 'group' => 'twitter', 'label' => 'Twitter Creator Handle', 'description' => '', 'sort_order' => 3],

            // ── Robots Defaults ─────────────────────────────
            ['key' => 'robots_user_agent', 'value' => '*', 'type' => 'text', 'group' => 'robots', 'label' => 'User Agent', 'description' => 'robots.txt User-Agent', 'sort_order' => 1],
            ['key' => 'robots_allow', 'value' => '/', 'type' => 'textarea', 'group' => 'robots', 'label' => 'Allow Rules', 'description' => 'One per line', 'sort_order' => 2],
            ['key' => 'robots_disallow', 'value' => "/admin/\n/api/", 'type' => 'textarea', 'group' => 'robots', 'label' => 'Disallow Rules', 'description' => 'One per line', 'sort_order' => 3],
            ['key' => 'robots_crawl_delay', 'value' => '', 'type' => 'text', 'group' => 'robots', 'label' => 'Crawl Delay', 'description' => 'Seconds between crawls', 'sort_order' => 4],
            ['key' => 'robots_sitemap_url', 'value' => 'https://business.auts.ac.in/sitemap.xml', 'type' => 'text', 'group' => 'robots', 'label' => 'Sitemap URL', 'description' => '', 'sort_order' => 5],
            ['key' => 'robots_host', 'value' => 'https://business.auts.ac.in', 'type' => 'text', 'group' => 'robots', 'label' => 'Host', 'description' => '', 'sort_order' => 6],
        ];

        foreach ($settings as $setting) {
            SeoSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
