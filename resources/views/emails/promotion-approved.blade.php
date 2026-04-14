@php
    $teacherName = $promotion->professeur?->full_name ?? 'Enseignant';
    $isGradePromotion = $promotion->type?->value === 'grade';
    $referenceNumber = data_get($promotion, 'new_reference_number');

    if ($referenceNumber === null) {
        $referenceNumber = config('promotion.reference_numbers')[$promotion->new_grade][$promotion->new_echelon] ?? null;
    }
@endphp
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Promotion validee</title>
</head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 12px;font-size:14px;color:#475569;">Portail des promotions universitaires</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Promotion validee</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
            Bonjour {{ $teacherName }},
        </p>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">
            Votre demande de promotion a ete approuvee par l'administration.
        </p>

        <div style="margin:0 0 18px;padding:20px;border-radius:18px;background:#eff6ff;border:1px solid #bfdbfe;">
            <p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#1d4ed8;">Nouveau palier</p>
            <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#0f172a;">
                {{ $isGradePromotion ? "Grade {$promotion->new_grade}" : "Echelon {$promotion->new_echelon}" }}
            </p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;">
                Grade {{ $promotion->new_grade }} • Echelon {{ $promotion->new_echelon }}
                @if ($referenceNumber)
                    • Reference {{ $referenceNumber }}
                @endif
            </p>
        </div>

        @if ($promotion->notes)
            <div style="margin:0 0 18px;padding:18px;border-radius:18px;background:#f8fafc;border:1px solid #e2e8f0;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#475569;">Note administrative</p>
                <p style="margin:0;font-size:14px;line-height:1.7;color:#334155;">{{ $promotion->notes }}</p>
            </div>
        @endif

        <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
            Cette information a egalement ete enregistree dans votre espace personnel.
        </p>
    </div>
</body>
</html>
