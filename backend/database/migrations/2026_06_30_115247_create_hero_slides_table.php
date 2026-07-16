<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('title_highlight', 255);
            $table->text('description');
            $table->string('badge', 255)->nullable();
            $table->string('image', 500)->nullable();
            $table->string('primary_btn_text', 100)->default('Apply Now');
            $table->string('primary_btn_link', 500)->default('/admissions/apply');
            $table->string('secondary_btn_text', 100)->default('Explore Programs');
            $table->string('secondary_btn_link', 500)->default('/academics');
            $table->string('float_card_num', 50)->nullable();
            $table->string('float_card_label', 100)->nullable();
            $table->enum('float_card_icon', ['Award', 'Target'])->default('Award');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_slides');
    }
};
