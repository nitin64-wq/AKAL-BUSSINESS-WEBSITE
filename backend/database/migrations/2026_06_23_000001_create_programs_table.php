<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('type', ['MBA', 'BBA', 'IMP', 'Executive', 'Doctoral', 'Certificate']);
            $table->string('duration');
            $table->text('description');
            $table->json('highlights'); // Store highlights as JSON array
            $table->text('eligibility')->nullable();
            $table->decimal('fee_per_year', 10, 2)->nullable();
            $table->integer('seats')->default(60);
            $table->string('cover_image')->nullable();
            $table->string('brochure_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('programs');
    }
};
