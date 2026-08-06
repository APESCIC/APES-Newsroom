<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>{{ config('app.name') }}</title>
        <link>{{ url('/') }}</link>
        <description>APES Newsroom — stories from APES CIC, Shelter &amp; Rescue, and Pet Care Clinic</description>
        <language>en-gb</language>
        <atom:link href="{{ url('/rss.xml') }}" rel="self" type="application/rss+xml" />
        @foreach ($posts as $post)
        <item>
            <title>{{ $post->title }}</title>
            <link>{{ url('/articles/'.$post->slug) }}</link>
            <guid isPermaLink="true">{{ url('/articles/'.$post->slug) }}</guid>
            <pubDate>{{ $post->published_at->toRfc2822String() }}</pubDate>
            <description><![CDATA[{{ $post->excerpt }}]]></description>
            <author>{{ $post->author->email }} ({{ $post->author->name }})</author>
        </item>
        @endforeach
    </channel>
</rss>
