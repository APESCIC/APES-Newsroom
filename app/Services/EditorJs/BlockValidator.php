<?php

namespace App\Services\EditorJs;

use Illuminate\Validation\ValidationException;

/**
 * Server-side Editor.js block allowlist and validation (issue #5).
 *
 * Client sanitization is convenience only — every save and render path
 * must pass through this validator.
 */
class BlockValidator
{
    /** @var array<int, string> */
    private const ALLOWED_TYPES = [
        'paragraph',
        'header',
        'list',
        'quote',
        'image',
        'table',
        'delimiter',
        'callout',
        'linkTool',
        'embed',
    ];

    /**
     * @param  array<string, mixed>  $document
     * @return array<string, mixed>
     */
    public function validate(array $document): array
    {
        if (! isset($document['blocks']) || ! is_array($document['blocks'])) {
            throw ValidationException::withMessages([
                'content' => 'Editor.js document must contain a blocks array.',
            ]);
        }

        $blocks = [];

        foreach ($document['blocks'] as $index => $block) {
            $blocks[] = $this->validateBlock($block, $index);
        }

        return [
            'time' => $document['time'] ?? now()->getTimestampMs(),
            'blocks' => $blocks,
            'version' => $document['version'] ?? '2.29.0',
        ];
    }

    /**
     * @param  mixed  $block
     * @return array<string, mixed>
     */
    private function validateBlock(mixed $block, int $index): array
    {
        if (! is_array($block) || ! isset($block['type'], $block['data'])) {
            throw ValidationException::withMessages([
                'content' => "Block at index {$index} is malformed.",
            ]);
        }

        $type = (string) $block['type'];

        if (! in_array($type, self::ALLOWED_TYPES, true)) {
            throw ValidationException::withMessages([
                'content' => "Block type '{$type}' is not allowed.",
            ]);
        }

        $data = $block['data'];

        if (! is_array($data)) {
            throw ValidationException::withMessages([
                'content' => "Block data at index {$index} must be an object.",
            ]);
        }

        return match ($type) {
            'paragraph' => ['type' => $type, 'data' => $this->validateParagraph($data, $index)],
            'header' => ['type' => $type, 'data' => $this->validateHeader($data, $index)],
            'list' => ['type' => $type, 'data' => $this->validateList($data, $index)],
            'quote' => ['type' => $type, 'data' => $this->validateQuote($data, $index)],
            'image' => ['type' => $type, 'data' => $this->validateImage($data, $index)],
            'delimiter' => ['type' => $type, 'data' => new \stdClass],
            'callout' => ['type' => $type, 'data' => $this->validateCallout($data, $index)],
            'linkTool' => ['type' => $type, 'data' => $this->validateLink($data, $index)],
            default => ['type' => $type, 'data' => $data],
        };
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    private function validateParagraph(array $data, int $index): array
    {
        $text = $this->sanitizeText($data['text'] ?? '', $index, 'paragraph');

        return ['text' => $text];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function validateHeader(array $data, int $index): array
    {
        $level = (int) ($data['level'] ?? 2);

        if (! in_array($level, [2, 3, 4], true)) {
            throw ValidationException::withMessages([
                'content' => "Header at index {$index} must be level 2, 3, or 4.",
            ]);
        }

        return [
            'text' => $this->sanitizeText($data['text'] ?? '', $index, 'header'),
            'level' => $level,
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function validateList(array $data, int $index): array
    {
        $style = ($data['style'] ?? 'unordered') === 'ordered' ? 'ordered' : 'unordered';
        $items = $data['items'] ?? [];

        if (! is_array($items)) {
            throw ValidationException::withMessages([
                'content' => "List at index {$index} must have items array.",
            ]);
        }

        return [
            'style' => $style,
            'items' => array_map(
                fn ($item) => $this->sanitizeText((string) $item, $index, 'list item'),
                $items
            ),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    private function validateQuote(array $data, int $index): array
    {
        return [
            'text' => $this->sanitizeText($data['text'] ?? '', $index, 'quote'),
            'caption' => $this->sanitizeText($data['caption'] ?? '', $index, 'quote caption'),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    private function validateImage(array $data, int $index): array
    {
        $url = (string) ($data['file']['url'] ?? $data['url'] ?? '');

        if ($url === '' || ! filter_var($url, FILTER_VALIDATE_URL)) {
            throw ValidationException::withMessages([
                'content' => "Image at index {$index} requires a valid URL.",
            ]);
        }

        $alt = $this->sanitizeText($data['alt'] ?? '', $index, 'image alt');

        if ($alt === '') {
            throw ValidationException::withMessages([
                'content' => "Image at index {$index} requires alt text.",
            ]);
        }

        return [
            'file' => ['url' => $url],
            'alt' => $alt,
            'caption' => $this->sanitizeText($data['caption'] ?? '', $index, 'caption'),
            'credit' => $this->sanitizeText($data['credit'] ?? '', $index, 'credit'),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    private function validateCallout(array $data, int $index): array
    {
        return [
            'text' => $this->sanitizeText($data['text'] ?? '', $index, 'callout'),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    private function validateLink(array $data, int $index): array
    {
        $url = (string) ($data['link'] ?? '');

        if ($url === '' || ! filter_var($url, FILTER_VALIDATE_URL)) {
            throw ValidationException::withMessages([
                'content' => "Link at index {$index} requires a valid URL.",
            ]);
        }

        return [
            'link' => $url,
            'meta' => [
                'title' => $this->sanitizeText($data['meta']['title'] ?? '', $index, 'link title'),
            ],
        ];
    }

    private function sanitizeText(string $text, int $index, string $context): string
    {
        if (strlen($text) > 10000) {
            throw ValidationException::withMessages([
                'content' => "Text in {$context} at index {$index} exceeds maximum length.",
            ]);
        }

        if (preg_match('/<script|javascript:/i', $text)) {
            throw ValidationException::withMessages([
                'content' => "Disallowed content in {$context} at index {$index}.",
            ]);
        }

        return strip_tags($text);
    }
}
