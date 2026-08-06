<?php

namespace App\Models;

use App\Enums\ConsentAction;
use App\Enums\MailingList;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'mailing_contact_id', 'email', 'list', 'action', 'source',
    'wording_version', 'evidence', 'ip_address', 'user_agent', 'created_at',
])]
class ConsentEvent extends Model
{
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'list' => MailingList::class,
            'action' => ConsentAction::class,
            'evidence' => 'array',
            'created_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<MailingContact, $this>
     */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(MailingContact::class, 'mailing_contact_id');
    }
}
