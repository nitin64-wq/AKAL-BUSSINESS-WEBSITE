<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('seo_meta', function (Blueprint $table) {
            $table->id();

            // Polymorphic: links to News, Programs, Events, Announcements, etc.
            $table->string('metable_type');
            $table->unsignedBigInteger('metable_id');

            // Core SEO
            $table->string('seo_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('meta_robots')->default('index, follow');

            // Open Graph
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();

            // Twitter
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image')->nullable();

            // SEO Analysis
            $table->string('focus_keyword')->nullable();
            $table->string('schema_type')->nullable();
            $table->json('custom_schema_json')->nullable();

            // AEO Fields
            $table->text('short_summary')->nullable();
            $table->text('ai_summary')->nullable();
            $table->text('quick_answer')->nullable();
            $table->text('featured_snippet')->nullable();
            $table->text('excerpt')->nullable();
            $table->integer('reading_time')->nullable();

            // Scores
            $table->integer('content_score')->nullable();
            $table->integer('eeat_score')->nullable();
            $table->integer('ai_readability_score')->nullable();
            $table->integer('generative_search_score')->nullable();

            $table->timestamps();

            $table->unique(['metable_type', 'metable_id']);
            $table->index(['metable_type', 'metable_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('seo_meta');
    }
};
