<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'application_no',
        'program_id',
        'full_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'city',
        'state',
        'pincode',
        'last_qualification',
        'marks_percentage',
        'entrance_exam',
        'entrance_score',
        'work_experience',
        'category',
        'status',
        'documents',
        'remarks',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'marks_percentage' => 'decimal:2',
        'work_experience' => 'integer',
        'documents' => 'array',
    ];

    // Scopes
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByProgram($query, int $programId)
    {
        return $query->where('program_id', $programId);
    }

    // Relationships
    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
