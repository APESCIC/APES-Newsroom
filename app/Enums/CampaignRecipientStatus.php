<?php

namespace App\Enums;

enum CampaignRecipientStatus: string
{
    case Queued = 'queued';
    case Accepted = 'accepted';
    case Failed = 'failed';
    case Skipped = 'skipped';
}
