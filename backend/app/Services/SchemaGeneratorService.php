<?php

namespace App\Services;

use App\Models\SeoSetting;

class SchemaGeneratorService
{
    /**
     * Generate Organization schema from global settings.
     */
    public function organization(): array
    {
        $settings = SeoSetting::getAllAsMap();

        return [
            '@context' => 'https://schema.org',
            '@type' => $settings['business_type'] ?? 'EducationalOrganization',
            '@id' => ($settings['default_canonical_url'] ?? '') . '/#organization',
            'name' => $settings['organization_name'] ?? $settings['website_name'] ?? '',
            'url' => $settings['default_canonical_url'] ?? '',
            'logo' => $settings['organization_logo'] ?? '',
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'telephone' => $settings['contact_phone'] ?? '',
                'contactType' => 'Admissions Office',
                'email' => $settings['contact_email'] ?? '',
                'areaServed' => 'IN',
                'availableLanguage' => ['en', 'hi'],
            ],
            'sameAs' => array_values(array_filter([
                $settings['social_facebook'] ?? null,
                $settings['social_instagram'] ?? null,
                $settings['social_linkedin'] ?? null,
                $settings['social_youtube'] ?? null,
                $settings['social_twitter'] ?? null,
            ])),
        ];
    }

    /**
     * Generate Website schema with SearchAction.
     */
    public function website(): array
    {
        $settings = SeoSetting::getAllAsMap();
        $url = $settings['default_canonical_url'] ?? '';

        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            '@id' => $url . '/#website',
            'name' => $settings['website_name'] ?? '',
            'url' => $url,
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => [
                    '@type' => 'EntryPoint',
                    'urlTemplate' => $url . '/search?q={search_term_string}',
                ],
                'query-input' => 'required name=search_term_string',
            ],
        ];
    }

    /**
     * Generate Article schema.
     */
    public function article(array $data): array
    {
        $settings = SeoSetting::getAllAsMap();

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $data['title'] ?? '',
            'description' => $data['description'] ?? '',
            'image' => $data['image'] ?? '',
            'author' => [
                '@type' => 'Person',
                'name' => $data['author'] ?? $settings['organization_name'] ?? '',
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => $settings['organization_name'] ?? '',
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => $settings['organization_logo'] ?? '',
                ],
            ],
            'datePublished' => $data['published_at'] ?? '',
            'dateModified' => $data['updated_at'] ?? $data['published_at'] ?? '',
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $data['url'] ?? '',
            ],
        ];
    }

    /**
     * Generate BlogPosting schema.
     */
    public function blogPosting(array $data): array
    {
        $schema = $this->article($data);
        $schema['@type'] = 'BlogPosting';
        if (isset($data['word_count'])) {
            $schema['wordCount'] = $data['word_count'];
        }
        return $schema;
    }

    /**
     * Generate FAQ schema from array of Q&A pairs.
     */
    public function faq(array $items): array
    {
        $mainEntity = [];
        foreach ($items as $item) {
            $mainEntity[] = [
                '@type' => 'Question',
                'name' => $item['question'] ?? '',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => strip_tags($item['answer'] ?? ''),
                ],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $mainEntity,
        ];
    }

    /**
     * Generate HowTo schema.
     */
    public function howTo(array $data): array
    {
        $steps = [];
        foreach (($data['steps'] ?? []) as $i => $step) {
            $steps[] = [
                '@type' => 'HowToStep',
                'position' => $i + 1,
                'name' => $step['name'] ?? '',
                'text' => $step['text'] ?? '',
                'image' => $step['image'] ?? '',
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'HowTo',
            'name' => $data['name'] ?? '',
            'description' => $data['description'] ?? '',
            'step' => $steps,
        ];
    }

    /**
     * Generate Breadcrumb schema.
     */
    public function breadcrumb(array $items): array
    {
        $list = [];
        foreach ($items as $i => $item) {
            $list[] = [
                '@type' => 'ListItem',
                'position' => $i + 1,
                'name' => $item['name'] ?? '',
                'item' => $item['url'] ?? '',
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $list,
        ];
    }

    /**
     * Generate LocalBusiness schema.
     */
    public function localBusiness(array $data = []): array
    {
        $settings = SeoSetting::getAllAsMap();

        return [
            '@context' => 'https://schema.org',
            '@type' => $data['type'] ?? 'EducationalOrganization',
            'name' => $data['name'] ?? $settings['organization_name'] ?? '',
            'url' => $data['url'] ?? $settings['default_canonical_url'] ?? '',
            'logo' => $data['logo'] ?? $settings['organization_logo'] ?? '',
            'telephone' => $data['phone'] ?? $settings['contact_phone'] ?? '',
            'email' => $data['email'] ?? $settings['contact_email'] ?? '',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $data['address'] ?? $settings['contact_address'] ?? '',
                'addressLocality' => $data['city'] ?? '',
                'addressRegion' => $data['state'] ?? '',
                'postalCode' => $data['zipcode'] ?? '',
                'addressCountry' => $data['country'] ?? 'IN',
            ],
        ];
    }

    /**
     * Generate Person schema.
     */
    public function person(array $data): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Person',
            'name' => $data['name'] ?? '',
            'jobTitle' => $data['job_title'] ?? '',
            'image' => $data['image'] ?? '',
            'url' => $data['url'] ?? '',
            'sameAs' => $data['social_links'] ?? [],
            'worksFor' => [
                '@type' => 'Organization',
                'name' => $data['organization'] ?? '',
            ],
        ];
    }

    /**
     * Generate VideoObject schema.
     */
    public function videoObject(array $data): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'VideoObject',
            'name' => $data['name'] ?? '',
            'description' => $data['description'] ?? '',
            'thumbnailUrl' => $data['thumbnail'] ?? '',
            'uploadDate' => $data['upload_date'] ?? '',
            'duration' => $data['duration'] ?? '',
            'contentUrl' => $data['content_url'] ?? '',
            'embedUrl' => $data['embed_url'] ?? '',
        ];
    }

    /**
     * Generate Event schema.
     */
    public function event(array $data): array
    {
        $settings = SeoSetting::getAllAsMap();

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Event',
            'name' => $data['name'] ?? '',
            'description' => $data['description'] ?? '',
            'startDate' => $data['start_date'] ?? '',
            'endDate' => $data['end_date'] ?? '',
            'location' => [
                '@type' => 'Place',
                'name' => $data['location_name'] ?? $settings['organization_name'] ?? '',
                'address' => $data['location_address'] ?? $settings['contact_address'] ?? '',
            ],
            'image' => $data['image'] ?? '',
            'organizer' => [
                '@type' => 'Organization',
                'name' => $settings['organization_name'] ?? '',
                'url' => $settings['default_canonical_url'] ?? '',
            ],
        ];
    }

    /**
     * Generate Product schema.
     */
    public function product(array $data): array
    {
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $data['name'] ?? '',
            'description' => $data['description'] ?? '',
            'image' => $data['image'] ?? '',
            'brand' => [
                '@type' => 'Brand',
                'name' => $data['brand'] ?? '',
            ],
        ];

        if (isset($data['sku'])) {
            $schema['sku'] = $data['sku'];
        }

        if (isset($data['price'])) {
            $schema['offers'] = [
                '@type' => 'Offer',
                'price' => $data['price'],
                'priceCurrency' => $data['currency'] ?? 'INR',
                'availability' => $data['availability'] ?? 'https://schema.org/InStock',
            ];
        }

        if (isset($data['rating'])) {
            $schema['aggregateRating'] = [
                '@type' => 'AggregateRating',
                'ratingValue' => $data['rating'],
                'reviewCount' => $data['review_count'] ?? 0,
            ];
        }

        return $schema;
    }

    /**
     * Generate SoftwareApplication schema.
     */
    public function softwareApplication(array $data): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'SoftwareApplication',
            'name' => $data['name'] ?? '',
            'operatingSystem' => $data['operating_system'] ?? '',
            'applicationCategory' => $data['category'] ?? '',
            'offers' => [
                '@type' => 'Offer',
                'price' => $data['price'] ?? '0',
                'priceCurrency' => $data['currency'] ?? 'INR',
            ],
        ];
    }

    /**
     * Generate SearchAction schema.
     */
    public function searchAction(array $data = []): array
    {
        $settings = SeoSetting::getAllAsMap();
        $url = $data['url'] ?? $settings['default_canonical_url'] ?? '';

        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'url' => $url,
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => $url . '/search?q={search_term_string}',
                'query-input' => 'required name=search_term_string',
            ],
        ];
    }

    /**
     * Generate a schema by type name.
     */
    public function generate(string $type, array $data = []): ?array
    {
        $method = lcfirst($type);
        if (method_exists($this, $method)) {
            return $this->$method($data);
        }
        return null;
    }
}
