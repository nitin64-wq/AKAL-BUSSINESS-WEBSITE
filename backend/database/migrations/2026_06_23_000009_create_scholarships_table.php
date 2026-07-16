<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('scholarships', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['Merit', 'Need-Based', 'Sports', 'Research', 'International']);
            $table->text('description');
            $table->text('eligibility')->nullable();
            $table->integer('amount_percent')->nullable(); // up to 100%
            $table->decimal('max_amount', 10, 2)->nullable();
            $table->date('application_deadline')->nullable();
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('scholarships');
    }
};
