<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professeur_id')->constrained()->cascadeOnDelete();
            $table->string('original_name');
            $table->string('display_name')->nullable();
            $table->string('stored_name')->unique();
            $table->string('file_path');
            $table->string('file_type', 20);
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['professeur_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
