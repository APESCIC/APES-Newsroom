# APES Newsroom — Email Template Spec (draft)

> **Status:** First-pass draft for stakeholder review (#2, #7).

## Campaign type: post-summary

Sent when an admin approves a published post with "email this post" enabled. One individually addressed message per recipient.

## Layout (single column, max 600px)

```
┌─────────────────────────────────────┐
│  APES Newsroom logo                 │
│  [Channel name pill]                │
├─────────────────────────────────────┤
│  [Hero image — alt text required]   │
│                                     │
│  Article title (linked)             │
│  Author · Date · Channel            │
│                                     │
│  Excerpt paragraph (plain text)     │
│                                     │
│  [ Read the full story → ]          │
├─────────────────────────────────────┤
│  APES CIC charity details           │
│  Contact address                    │
│  Manage preferences | Unsubscribe │
└─────────────────────────────────────┘
```

## Content rules

- **Include:** branded title, hero image, excerpt, author/date/channel metadata, read-more link
- **Exclude:** full Editor.js document, tracking pixels, click tracking, CC/BCC
- **Snapshot:** campaign content frozen at approval; later article edits do not change in-flight sends

## Headers

- `From`: configured Cloudron SMTP identity
- `Reply-To`: editorial contact address
- `List-Unsubscribe`: signed one-click URL per list
- `List-Unsubscribe-Post`: `List-Unsubscribe=One-Click` (RFC 8058)

## Accessibility (HTML email)

- Semantic headings (`h1` for title)
- Alt text on hero image (required)
- Sufficient colour contrast (4.5:1 body text)
- Plain-text alternative part generated alongside HTML
- Links descriptive ("Read the full story" not "click here")

## Test send

- Clearly labelled "Test send" in admin UI
- Test sends use a dedicated queue/job type that cannot trigger live campaign delivery
- Test recipient must be explicitly entered; never pre-filled from live lists

## Throttle

Default 60 recipients/minute, configurable after capacity testing on beta.
