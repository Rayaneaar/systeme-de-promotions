<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>{{ $subjectLine }}</title>
  </head>
  <body style="margin:0;padding:24px;background:#f3f6fb;font-family:Arial,sans-serif;color:#0f172a;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px;box-shadow:0 18px 40px rgba(15,23,42,0.08);">
      <p style="margin:0 0 12px;font-size:14px;color:#475569;">Portail des promotions universitaires</p>
      <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;">{{ $subjectLine }}</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">Bonjour {{ $professeur->full_name }},</p>
      <div style="font-size:15px;line-height:1.8;color:#334155;white-space:pre-line;">{{ $messageBody }}</div>
      <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#64748b;">
        Ce message a ete envoye depuis l'espace administrateur.
      </p>
    </div>
  </body>
</html>
