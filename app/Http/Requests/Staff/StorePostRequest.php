<?php

namespace App\Http\Requests\Staff;

use App\Enums\Channel;
use App\Enums\MailingList;
use App\Enums\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role->atLeast(Role::Staff) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug'],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'content' => ['required', 'array'],
            'channel' => ['required', Rule::enum(Channel::class)],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'email_on_publish' => ['sometimes', 'boolean'],
            'mailing_lists' => ['nullable', 'array'],
            'mailing_lists.*' => [Rule::enum(MailingList::class)],
        ];
    }
}
