<?php

namespace App\Http\Requests\Staff;

use App\Enums\Channel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role->atLeast(\App\Enums\Role::Staff) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('posts', 'slug')->ignore($this->route('post'))],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'content' => ['required', 'array'],
            'channel' => ['required', Rule::enum(Channel::class)],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
