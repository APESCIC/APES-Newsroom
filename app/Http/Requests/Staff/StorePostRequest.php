<?php

namespace App\Http\Requests\Staff;

use App\Enums\Role;
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    use PostPayloadRules;

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
            ...$this->baseRules(),
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug'],
        ];
    }
}
