<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professeurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->unique();
            $table->string('num_dr', 30)->unique()->index();
            $table->string('cin', 20)->nullable()->unique();
            $table->string('ppr', 20)->nullable()->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth')->nullable();
            $table->string('phone', 30)->nullable();
            $table->text('address')->nullable();
            $table->string('specialite')->nullable();
            $table->enum('grade', ['A', 'B', 'C'])->index();
            $table->unsignedTinyInteger('echelon')->default(1)->index();
            $table->date('date_recrutement');
            $table->date('date_last_promotion')->nullable();
            $table->date('date_last_grade_promotion')->nullable();
            $table->date('date_last_echelon_promotion')->nullable();
            $table->unsignedSmallInteger('anciennete_cache')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('professeurs');
    }
};
