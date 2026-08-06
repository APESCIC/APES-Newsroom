<?php

namespace Tests\Unit;

use App\Services\EditorJs\BlockValidator;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class BlockValidatorTest extends TestCase
{
    public function test_valid_paragraph_block_passes(): void
    {
        $result = (new BlockValidator)->validate([
            'blocks' => [['type' => 'paragraph', 'data' => ['text' => 'Hello world']]],
        ]);

        $this->assertCount(1, $result['blocks']);
    }

    public function test_script_in_text_is_rejected(): void
    {
        $this->expectException(ValidationException::class);

        (new BlockValidator)->validate([
            'blocks' => [['type' => 'paragraph', 'data' => ['text' => '<script>alert(1)</script>']]],
        ]);
    }

    public function test_disallowed_block_type_is_rejected(): void
    {
        $this->expectException(ValidationException::class);

        (new BlockValidator)->validate([
            'blocks' => [['type' => 'raw', 'data' => ['html' => '<p>x</p>']]],
        ]);
    }

    public function test_image_requires_alt_text(): void
    {
        $this->expectException(ValidationException::class);

        (new BlockValidator)->validate([
            'blocks' => [[
                'type' => 'image',
                'data' => ['file' => ['url' => 'https://example.com/img.jpg']],
            ]],
        ]);
    }

    public function test_table_and_embed_are_validated(): void
    {
        $result = (new BlockValidator)->validate([
            'blocks' => [
                [
                    'type' => 'table',
                    'data' => [
                        'withHeadings' => true,
                        'content' => [['A', 'B'], ['1', '2']],
                    ],
                ],
                [
                    'type' => 'embed',
                    'data' => [
                        'service' => 'youtube',
                        'source' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'embed' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    ],
                ],
            ],
        ]);

        $this->assertSame('table', $result['blocks'][0]['type']);
        $this->assertSame('embed', $result['blocks'][1]['type']);
    }

    public function test_unapproved_embed_is_rejected(): void
    {
        $this->expectException(ValidationException::class);

        (new BlockValidator)->validate([
            'blocks' => [[
                'type' => 'embed',
                'data' => [
                    'service' => 'unknown',
                    'source' => 'https://example.com/x',
                ],
            ]],
        ]);
    }
}
