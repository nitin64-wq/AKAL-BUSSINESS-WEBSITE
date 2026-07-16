<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    protected static function bootAuditable()
    {
        static::created(function ($model) {
            $model->logAudit('create', null, $model->attributesToArray());
        });

        static::updated(function ($model) {
            $old = [];
            $new = [];
            foreach ($model->getDirty() as $key => $value) {
                if ($key === 'updated_at') continue;
                $old[$key] = $model->getOriginal($key);
                $new[$key] = $value;
            }
            if (!empty($new)) {
                $model->logAudit('update', $old, $new);
            }
        });

        static::deleted(function ($model) {
            $model->logAudit('delete', $model->attributesToArray(), null);
        });
    }

    protected function logAudit(string $action, ?array $old, ?array $new)
    {
        // Don't log system seeding or CLI activities unless there's an active request
        if (app()->runningInConsole() && !request()) {
            return;
        }

        try {
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'model_type' => get_class($this),
                'model_id' => $this->id,
                'changes' => [
                    'old' => $old,
                    'new' => $new,
                ],
                'ip_address' => request() ? request()->ip() : '127.0.0.1',
                'user_agent' => request() ? request()->userAgent() : 'CLI',
            ]);
        } catch (\Exception $e) {
            logger()->error("Failed to write audit log: " . $e->getMessage());
        }
    }
}
