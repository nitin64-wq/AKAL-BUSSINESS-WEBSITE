<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('page_seo', function (Blueprint $table) {
            $table->id();
            $table->string('page_identifier')->unique(); // e.g. 'about', 'academics', 'contact'
            $table->string('page_title')->nullable(); // Human-readable page name

            // Core SEO
            $table->string('seo_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('slug')->unique()->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('meta_robots')->default('index, follow');

            // Open Graph
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('og_type')->default('website');

            // Twitter
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image')->nullable();
            $table->string('twitter_card')->default('summary_large_image');

            // SEO Analysis
            $table->string('focus_keyword')->nullable();
            $table->string('schema_type')->nullable();
            $table->json('custom_schema_json')->nullable();

            // Content Metadata
            $table->timestamp('publish_date')->nullable();
            $table->timestamp('updated_date')->nullable();
            $table->string('author')->nullable();
            $table->string('breadcrumb_title')->nullable();

            // AEO
            $table->text('short_summary')->nullable();
            $table->text('ai_summary')->nullable();
            $table->text('quick_answer')->nullable();
            $table->text('featured_snippet')->nullable();

            // Scores
            $table->integer('content_score')->nullable();
            $table->integer('eeat_score')->nullable();
            $table->integer('ai_readability_score')->nullable();

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('page_seo');
    }
};
