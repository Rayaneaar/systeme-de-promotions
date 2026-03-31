<?php

return [
    'cadre_label' => 'Maitre de Conferences',

    'max_echelon' => 4,

    'echelon_rules' => [
        1 => ['next' => 2, 'years_required' => 2],
        2 => ['next' => 3, 'years_required' => 2],
        3 => ['next' => 4, 'years_required' => 2],
    ],

    'grade_rules' => [
        'A' => [
            'next' => 'B',
            'min_echelon' => 3,
            'years_in_grade_required' => 6,
            'years_in_echelon_required' => 2,
        ],
        'B' => [
            'next' => 'C',
            'min_echelon' => 3,
            'years_in_grade_required' => 6,
            'years_in_echelon_required' => 2,
        ],
    ],
];
