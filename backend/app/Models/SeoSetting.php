<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    use HasFactory;

    protected $table = 'seo_settings';

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'label',
        'description',
        'sort_order',
    ];

    // ── Scopes ──────────────────────────────────────────────

    public function scopeByGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    // ── Helpers ─────────────────────────────────────────────

    /**
     * Get a single setting value by key with type casting.
     */
    public static function getValue(string $key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        switch ($setting->type) {
            case 'boolean':
                return filter_var($setting->value, FILTER_VALIDATE_BOOLEAN);
            case 'json':
                return json_decode($setting->value, true);
            case 'number':
                return is_numeric($setting->value) ? $setting->value + 0 : $setting->value;
            default:
                return $setting->value;
        }
    }

    /**
     * Set a single setting value by key.
     */
    public static function setValue(string $key, $value): void
    {
        $setting = self::where('key', $key)->first();
        if ($setting) {
            $setting->update(['value' => is_array($value) ? json_encode($value) : (string) $value]);
        }
    }

    /**
     * Get all settings as a flat key => value map (with type casting).
     */
    public static function getAllAsMap(): array
    {
        $settings = self::orderBy('group')->orderBy('sort_order')->get();
        $map = [];

        foreach ($settings as $setting) {
            switch ($setting->type) {
                case 'boolean':
                    $map[$setting->key] = filter_var($setting->value, FILTER_VALIDATE_BOOLEAN);
                    break;
                case 'json':
                    $map[$setting->key] = json_decode($setting->value, true);
                    break;
                case 'number':
                    $map[$setting->key] = is_numeric($setting->value) ? $setting->value + 0 : $setting->value;
                    break;
                default:
                    $map[$setting->key] = $setting->value;
                    break;
            }
        }

        return $map;
    }

    /**
     * Get all settings grouped by their group field.
     */
    public static function getAllGrouped(): array
    {
        return self::orderBy('group')->orderBy('sort_order')
            ->get()
            ->groupBy('group')
            ->toArray();
    }
}
