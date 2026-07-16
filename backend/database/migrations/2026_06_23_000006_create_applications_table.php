<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_no')->unique();
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Other', 'Prefer not to say'])->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('pincode')->nullable();
            $table->string('last_qualification')->nullable();
            $table->decimal('marks_percentage', 5, 2)->nullable();
            $table->string('entrance_exam')->nullable();
            $table->string('entrance_score')->nullable();
            $table->integer('work_experience')->default(0); // in months
            $table->enum('category', ['General', 'SC', 'ST', 'OBC', 'EWS', 'PWD'])->default('General');
            $table->enum('status', [
                'Pending',
                'Under Review',
                'Shortlisted',
                'Accepted',
                'Rejected',
                'Waitlist'
            ])->default('Pending');
            $table->json('documents')->nullable(); // Store file paths as JSON map
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('applications');
    }
};
