<?php

namespace App\Models;

use Database\Factories\MailingContactFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

#[Fillable(['email', 'user_id'])]
class MailingContact extends Model
{
    /** @use HasFactory<MailingContactFactory> */
    use HasFactory, Notifiable;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<MailingListSubscription, $this>
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(MailingListSubscription::class);
    }

    /**
     * Route mail notifications to the contact email.
     */
    public function routeNotificationForMail(): string
    {
        return $this->email;
    }
}
