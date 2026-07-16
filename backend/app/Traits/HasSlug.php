<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    protected static function bootHasSlug()
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $sourceField = $model->slugSource() ?? 'title';
                $source = $model->{$sourceField};
                $slug = Str::slug($source);

                // Check if slug already exists and make it unique
                $originalSlug = $slug;
                $count = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$originalSlug}-{$count}";
                    $count++;
                }

                $model->slug = $slug;
            }
        });

        static::updating(function ($model) {
            // Re-generate slug only if the title/name has changed
            $sourceField = $model->slugSource() ?? 'title';
            if ($model->isDirty($sourceField)) {
                $source = $model->{$sourceField};
                $slug = Str::slug($source);

                $originalSlug = $slug;
                $count = 1;
                while (static::where('slug', $slug)->where('id', '!=', $model->id)->exists()) {
                    $slug = "{$originalSlug}-{$count}";
                    $count++;
                }

                $model->slug = $slug;
            }
        });
    }

    /**
     * Default source field for slug. Can be overridden in models.
     */
    public function slugSource(): string
    {
        return 'title';
    }
}
