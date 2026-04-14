<?php

namespace App\Mail;

use App\Models\Promotion;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PromotionApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Promotion $promotion
    ) {
    }

    public function envelope(): Envelope
    {
        $teacherName = $this->promotion->professeur?->full_name ?? 'Enseignant';

        return new Envelope(
            subject: "Promotion validee - {$teacherName}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.promotion-approved',
        );
    }
}
