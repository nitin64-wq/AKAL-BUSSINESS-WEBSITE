<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('geo_meta', function (Blueprint $table) {
            $table->id();

            // Can attach to a static page
            $table->unsignedBigInteger('page_seo_id')->nullable();
            $table->foreign('page_seo_id')->references('id')->on('page_seo')->onDelete('cascade');

            // Or polymorphic to any content model
            $table->string('metable_type')->nullable();
            $table->unsignedBigInteger('metable_id')->nullable();

            // GEO Fields
            $table->text('author_bio')->nullable();
            $table->json('references')->nullable(); // Array of reference URLs/citations
            $table->json('sources')->nullable(); // Array of source objects
            $table->text('publication_date')->nullable();
            $table->text('last_updated')->nullable();
            $table->integer('reading_time')->nullable();
            $table->json('entity_keywords')->nullable(); // Array of entity keywords
            $table->json('structured_headings')->nullable(); // Array of heading objects
            $table->integer('content_score')->nullable();
            $table->integer('ai_readability_score')->nullable();
            $table->integer('generative_search_score')->nullable();
            $table->integer('eeat_score')->nullable();
            $table->json('internal_linking_suggestions')->nullable(); // Array of link suggestions

            $table->timestamps();

            $table->index(['metable_type', 'metable_id']);
            $table->index('page_seo_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('geo_meta');
    }
};
