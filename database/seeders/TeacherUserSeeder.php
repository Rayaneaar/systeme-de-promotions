<?php

namespace Database\Seeders;

use App\Enums\GradeEnum;
use App\Enums\RoleEnum;
use App\Models\Professeur;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TeacherUserSeeder extends Seeder
{
    public function run(): void
    {
        $teachers = [
            [
                'user' => ['name' => 'Amir Abbou', 'email' => 'teacher1@example.com'],
                'professeur' => [
                    'num_dr' => 'DRPP 001',
                    'cin' => 'AB123456',
                    'ppr' => '10020030',
                    'first_name' => 'Amir',
                    'last_name' => 'Abbou',
                    'date_of_birth' => '1961-01-01',
                    'phone' => '0612345678',
                    'address' => 'Rabat, Maroc',
                    'specialite' => 'Informatique',
                    'grade' => GradeEnum::A,
                    'echelon' => 3,
                    'date_recrutement' => '2015-01-01',
                    'date_last_promotion' => '2019-01-01',
                    'date_last_grade_promotion' => '2015-01-01',
                    'date_last_echelon_promotion' => '2019-01-01',
                    'anciennete_cache' => Carbon::parse('2015-01-01')->diffInYears(now()),
                ],
            ],
            [
                'user' => ['name' => 'Hanane Abdelghani', 'email' => 'teacher2@example.com'],
                'professeur' => [
                    'num_dr' => 'DRPP 002',
                    'cin' => 'CD987654',
                    'ppr' => '10020031',
                    'first_name' => 'Hanane',
                    'last_name' => 'Abdelghani',
                    'date_of_birth' => '1961-02-02',
                    'phone' => '0623456789',
                    'address' => 'Fes, Maroc',
                    'specialite' => 'Mathematiques',
                    'grade' => GradeEnum::B,
                    'echelon' => 2,
                    'date_recrutement' => '2015-03-01',
                    'date_last_promotion' => '2023-03-01',
                    'date_last_grade_promotion' => '2021-03-01',
                    'date_last_echelon_promotion' => '2023-03-01',
                    'anciennete_cache' => Carbon::parse('2015-03-01')->diffInYears(now()),
                ],
            ],
            [
                'user' => ['name' => 'Adam Abdermoumen', 'email' => 'teacher3@example.com'],
                'professeur' => [
                    'num_dr' => 'DRPP 003',
                    'cin' => 'EF456789',
                    'ppr' => '10020032',
                    'first_name' => 'Adam',
                    'last_name' => 'Abdermoumen',
                    'date_of_birth' => '1961-03-03',
                    'phone' => '0634567890',
                    'address' => 'Casablanca, Maroc',
                    'specialite' => 'Physique',
                    'grade' => GradeEnum::A,
                    'echelon' => 2,
                    'date_recrutement' => '2015-05-01',
                    'date_last_promotion' => '2017-05-01',
                    'date_last_grade_promotion' => '2015-05-01',
                    'date_last_echelon_promotion' => '2017-05-01',
                    'anciennete_cache' => Carbon::parse('2015-05-01')->diffInYears(now()),
                ],
            ],
            [
                'user' => ['name' => 'Abir Alhajbah', 'email' => 'teacher4@example.com'],
                'professeur' => [
                    'num_dr' => 'DRPP 016',
                    'cin' => 'GH654321',
                    'ppr' => '10020033',
                    'first_name' => 'Abir',
                    'last_name' => 'Alhajbah',
                    'date_of_birth' => '1962-01-01',
                    'phone' => '0645678901',
                    'address' => 'Meknes, Maroc',
                    'specialite' => 'Chimie',
                    'grade' => GradeEnum::B,
                    'echelon' => 4,
                    'date_recrutement' => '2015-07-01',
                    'date_last_promotion' => '2023-07-01',
                    'date_last_grade_promotion' => '2021-07-01',
                    'date_last_echelon_promotion' => '2023-07-01',
                    'anciennete_cache' => Carbon::parse('2015-07-01')->diffInYears(now()),
                ],
            ],
        ];

        foreach ($teachers as $teacherData) {
            $user = User::updateOrCreate(
                ['email' => $teacherData['user']['email']],
                [
                    'name' => $teacherData['user']['name'],
                    'password' => 'password',
                    'role' => RoleEnum::TEACHER,
                ]
            );

            Professeur::updateOrCreate(
                ['user_id' => $user->id],
                [...$teacherData['professeur'], 'user_id' => $user->id]
            );
        }

        User::factory(6)
            ->state(['role' => RoleEnum::TEACHER])
            ->create()
            ->each(function (User $user) {
                Professeur::factory()->create([
                    'user_id' => $user->id,
                    'num_dr' => 'DRPP '.str_pad((string) fake()->unique()->numberBetween(17, 999), 3, '0', STR_PAD_LEFT),
                    'cin' => fake()->boolean(60) ? strtoupper(fake()->unique()->bothify('??######')) : null,
                    'ppr' => fake()->boolean(60) ? fake()->unique()->numerify('########') : null,
                    'first_name' => explode(' ', $user->name)[0] ?? 'Prof',
                    'last_name' => explode(' ', $user->name)[1] ?? 'esseur',
                ]);
            });
    }
}
