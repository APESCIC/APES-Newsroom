<?php

namespace App\Enums;

enum CampaignStatus: string
{
    case Draft = 'draft';
    case Queued = 'queued';
    case Sending = 'sending';
    case Completed = 'completed';
    case Failed = 'failed';
    case Cancelled = 'cancelled';
}
