<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Response;

class RssController extends Controller
{
    public function index(): Response
    {
        $posts = Post::published()->with('author')->latest('published_at')->limit(50)->get();

        $xml = view('rss', ['posts' => $posts])->render();

        return response($xml, 200, ['Content-Type' => 'application/rss+xml']);
    }
}
