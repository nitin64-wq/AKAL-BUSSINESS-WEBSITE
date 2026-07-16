<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('seo_schemas', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Human-readable label
            $table->string('schema_type'); // Organization, Article, BlogPosting, Product, FAQ, HowTo, Breadcrumb, LocalBusiness, Person, VideoObject, Event, SoftwareApplication, SearchAction, Website
            $table->json('json_data'); // The full JSON-LD payload

            // Can attach to a static page
            $table->unsignedBigInteger('page_seo_id')->nullable();
            $table->foreign('page_seo_id')->references('id')->on('page_seo')->onDelete('cascade');

            // Or attach to any content model (polymorphic)
            $table->string('metable_type')->nullable();
            $table->unsignedBigInteger('metable_id')->nullable();

            $table->boolean('is_global')->default(false); // Rendered on all pages
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['metable_type', 'metable_id']);
            $table->index('schema_type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('seo_schemas');
    }
};
