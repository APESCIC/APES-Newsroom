# Data inventory (issue #10)

Draft engineering inventory for APES Newsroom. Legal/compliance sign-off is still required before treating this as approved.

| Data category | Systems / tables | Lawful basis (draft) | Retention (draft) | Access |
|---------------|------------------|----------------------|-------------------|--------|
| Public account identity | `users` (name, email, password hash, verification) | Contract / legitimate interests for newsroom access | Until account deletion request + 30 days backup | User, admins |
| Staff identity / roles | `users.role`, OIDC `external_id`, `ldap_group_snapshot` | Legitimate interests (staff access control) | While employed + audit retention | Admins / super admins |
| Editorial content | `posts`, `post_revisions`, `tags`, media on disk | Legitimate interests / public task of APES communications | Indefinite while published; soft-deleted retained 12 months | Staff / admins |
| Mailing contacts | `mailing_contacts`, `mailing_list_subscriptions`, `consent_events`, `suppressions` | Consent (PECR/GDPR) | Consent evidence retained 2 years after last campaign interaction or until erasure where required | Admins |
| Campaign delivery | `campaigns`, `campaign_recipients` | Consent / legitimate interests for send operations | 24 months operational metrics | Admins |
| Engagement | `profiles`, `comments`, `reactions`, `moderation_reports`, `moderation_audits` | Consent / legitimate interests for community features | Soft-deleted comments 12 months; moderation audits 24 months | Admins |
| Privileged audits | `audit_logs`, `import_runs` | Legitimate interests (security / accountability) | 24 months | Admins / super admins |
| Session / CSRF | cookies, session store (Redis/file) | Necessary for service | Session lifetime | System |
| Logs | application logs on Cloudron | Legitimate interests (security/ops) | 90 days (ops default) | Ops / admins |

## Rights workflows (product)

- Access / portability: `/account/export`
- Rectification: `/account` profile update
- Erasure: `/account` delete
- Mailing preferences / withdraw consent: `/account/mailing`, signed `/mailing/preferences`, `/mailing/unsubscribe`
- Objection / report harmful content: report controls on comments; admin moderation queue

## Sign-off

- [ ] Legal / compliance approval recorded on issue #10
- [ ] Accessibility approval recorded on issue #10
