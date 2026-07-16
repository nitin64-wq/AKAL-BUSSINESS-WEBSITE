<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();

            // Can attach to a static page
            $table->unsignedBigInteger('page_seo_id')->nullable();
            $table->foreign('page_seo_id')->references('id')->on('page_seo')->onDelete('cascade');

            // Or polymorphic to any content model
            $table->string('faqable_type')->nullable();
            $table->unsignedBigInteger('faqable_id')->nullable();

            $table->text('question');
            $table->longText('answer');
            $table->text('short_summary')->nullable();
            $table->text('ai_summary')->nullable();

            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['faqable_type', 'faqable_id']);
            $table->index('page_seo_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('faqs');
    }
};
