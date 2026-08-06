<?php

namespace App\Notifications;

use App\Enums\MailingList;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ConfirmMailingListNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly MailingList $list,
        private readonly string $confirmUrl,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Confirm your '.$this->list->label().' subscription')
            ->line('You asked to join the '.$this->list->label().' mailing list.')
            ->line($this->list->purpose())
            ->action('Confirm subscription', $this->confirmUrl)
            ->line('If you did not request this, you can ignore this email.');
    }
}
