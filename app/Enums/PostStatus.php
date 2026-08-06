<?php

namespace App\Enums;

enum PostStatus: string
{
    case Draft = 'draft';
    case InReview = 'in_review';
    case Scheduled = 'scheduled';
    case Published = 'published';
    case Unpublished = 'unpublished';
    case Deleted = 'deleted';

    public function isPubliclyVisible(): bool
    {
        return $this === self::Published;
    }
}
