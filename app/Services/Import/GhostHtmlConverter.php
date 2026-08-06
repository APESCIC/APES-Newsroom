<?php

namespace App\Services\Import;

/**
 * Convert common Ghost HTML into Editor.js blocks; unsupported HTML becomes a legacy block.
 */
class GhostHtmlConverter
{
    /**
     * @return array{blocks: list<array{type: string, data: array<string, mixed>}>, needs_review: bool}
     */
    public function convert(?string $html): array
    {
        $html = trim((string) $html);
        if ($html === '') {
            return [
                'blocks' => [['type' => 'paragraph', 'data' => ['text' => '']]],
                'needs_review' => false,
            ];
        }

        $needsReview = (bool) preg_match('/<(div|table|iframe|aside|section|article|script)\b/i', $html);
        $blocks = [];
        $parts = preg_split('/(<\/?(?:p|h[2-4]|ul|ol|blockquote|hr|figure|table)[^>]*>)/i', $html, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
        if ($parts === false) {
            return $this->legacy($html);
        }

        $buffer = '';
        $open = null;

        foreach ($parts as $part) {
            if (preg_match('/^<(p|h([2-4])|ul|ol|blockquote|hr|figure|table)(\s|>)/i', $part, $m)) {
                $open = strtolower($m[1]);
                $buffer = $part;
                if ($open === 'hr') {
                    $blocks[] = ['type' => 'delimiter', 'data' => new \stdClass];
                    $open = null;
                    $buffer = '';
                }

                continue;
            }

            if ($open && preg_match('/^<\/'.preg_quote($open, '/').'>$/i', $part)) {
                $buffer .= $part;
                $converted = $this->convertFragment($open, $buffer);
                if ($converted === null) {
                    $needsReview = true;
                    $blocks[] = [
                        'type' => 'legacy',
                        'data' => [
                            'html' => strip_tags($buffer, '<p><br><strong><em><ul><ol><li><a><h2><h3><h4><blockquote><img><figure><figcaption><table><thead><tbody><tr><th><td><hr>'),
                            'needs_review' => true,
                            'note' => 'Unsupported Ghost HTML fragment',
                        ],
                    ];
                } else {
                    $blocks[] = $converted;
                }
                $open = null;
                $buffer = '';

                continue;
            }

            if ($open) {
                $buffer .= $part;
            } else {
                $text = trim(strip_tags($part));
                if ($text !== '') {
                    $blocks[] = ['type' => 'paragraph', 'data' => ['text' => $text]];
                }
            }
        }

        if ($buffer !== '') {
            $needsReview = true;
            $legacy = $this->legacy($buffer);
            $blocks = array_merge($blocks, $legacy['blocks']);
        }

        if ($blocks === []) {
            return $this->legacy($html);
        }

        return ['blocks' => $blocks, 'needs_review' => $needsReview];
    }

    /**
     * @return array{type: string, data: array<string, mixed>}|null
     */
    private function convertFragment(string $tag, string $html): ?array
    {
        return match ($tag) {
            'p' => ['type' => 'paragraph', 'data' => ['text' => trim(strip_tags($html))]],
            'h2', 'h3', 'h4' => [
                'type' => 'header',
                'data' => [
                    'text' => trim(strip_tags($html)),
                    'level' => (int) substr($tag, 1),
                ],
            ],
            'ul', 'ol' => $this->convertList($tag, $html),
            'blockquote' => [
                'type' => 'quote',
                'data' => [
                    'text' => trim(strip_tags($html)),
                    'caption' => '',
                ],
            ],
            'figure' => $this->convertFigure($html),
            default => null,
        };
    }

    /**
     * @return array{type: string, data: array<string, mixed>}|null
     */
    private function convertList(string $tag, string $html): ?array
    {
        preg_match_all('/<li[^>]*>(.*?)<\/li>/is', $html, $matches);
        $items = array_map(fn ($item) => trim(strip_tags($item)), $matches[1] ?? []);

        if ($items === []) {
            return null;
        }

        return [
            'type' => 'list',
            'data' => [
                'style' => $tag === 'ol' ? 'ordered' : 'unordered',
                'items' => $items,
            ],
        ];
    }

    /**
     * @return array{type: string, data: array<string, mixed>}|null
     */
    private function convertFigure(string $html): ?array
    {
        if (! preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $m)) {
            return null;
        }

        $alt = '';
        if (preg_match('/alt=["\']([^"\']*)["\']/i', $html, $altMatch)) {
            $alt = $altMatch[1];
        }
        if ($alt === '') {
            $alt = 'Imported image';
        }

        $caption = '';
        if (preg_match('/<figcaption[^>]*>(.*?)<\/figcaption>/is', $html, $cap)) {
            $caption = trim(strip_tags($cap[1]));
        }

        return [
            'type' => 'image',
            'data' => [
                'file' => ['url' => $m[1]],
                'alt' => $alt,
                'caption' => $caption,
                'credit' => '',
            ],
        ];
    }

    /**
     * @return array{blocks: list<array{type: string, data: array<string, mixed>}>, needs_review: bool}
     */
    private function legacy(string $html): array
    {
        return [
            'blocks' => [[
                'type' => 'legacy',
                'data' => [
                    'html' => strip_tags($html, '<p><br><strong><em><ul><ol><li><a><h2><h3><h4><blockquote><img><figure><figcaption><table><thead><tbody><tr><th><td><hr>'),
                    'needs_review' => true,
                    'note' => 'Imported legacy HTML',
                ],
            ]],
            'needs_review' => true,
        ];
    }
}
