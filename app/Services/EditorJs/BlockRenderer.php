<?php

namespace App\Services\EditorJs;

/**
 * Renders validated Editor.js blocks to safe HTML for public display.
 */
class BlockRenderer
{
    /**
     * @param  array<string, mixed>  $document
     */
    public function toHtml(array $document): string
    {
        $html = '';

        foreach ($document['blocks'] ?? [] as $block) {
            $html .= $this->renderBlock($block);
        }

        return $html;
    }

    /**
     * @param  array<string, mixed>  $block
     */
    private function renderBlock(array $block): string
    {
        $type = $block['type'] ?? '';
        $data = $block['data'] ?? [];

        return match ($type) {
            'paragraph' => '<p>'.e($data['text'] ?? '').'</p>',
            'header' => '<h'.(int) ($data['level'] ?? 2).'>'.e($data['text'] ?? '').'</h'.(int) ($data['level'] ?? 2).'>',
            'list' => $this->renderList($data),
            'quote' => '<blockquote><p>'.e($data['text'] ?? '').'</p>'.(($data['caption'] ?? '') ? '<cite>'.e($data['caption']).'</cite>' : '').'</blockquote>',
            'image' => $this->renderImage($data),
            'delimiter' => '<hr />',
            'callout' => '<aside class="callout">'.e($data['text'] ?? '').'</aside>',
            'linkTool' => '<p><a href="'.e($data['link'] ?? '').'">'.e($data['meta']['title'] ?? $data['link'] ?? '').'</a></p>',
            default => '',
        };
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function renderList(array $data): string
    {
        $tag = ($data['style'] ?? '') === 'ordered' ? 'ol' : 'ul';
        $items = '';

        foreach ($data['items'] ?? [] as $item) {
            $items .= '<li>'.e($item).'</li>';
        }

        return "<{$tag}>{$items}</{$tag}>";
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function renderImage(array $data): string
    {
        $url = e($data['file']['url'] ?? $data['url'] ?? '');
        $alt = e($data['alt'] ?? '');
        $caption = ($data['caption'] ?? '') ? '<figcaption>'.e($data['caption']).'</figcaption>' : '';

        return "<figure><img src=\"{$url}\" alt=\"{$alt}\" loading=\"lazy\" />{$caption}</figure>";
    }
}
