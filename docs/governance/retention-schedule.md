# Retention schedule (issue #10)

Draft retention periods for operators. Confirm with legal before cutover.

| Record | Retention | Disposal |
|--------|-----------|----------|
| Published posts | While published + historical archive | Soft delete → hard delete after 12 months unless legal hold |
| Post revisions | 24 months after post soft-delete | Cascade with post hard delete |
| Account data | Until user deletion | Export available; delete within 30 days of request |
| Consent events | 2 years after last relevant mailing activity | Anonymise email if erasure required and suppression must remain |
| Suppressions | Indefinite while needed to honour objection | Keep hashed/minimal email if full erasure conflicts with PECR honouring |
| Campaign recipients | 24 months | Delete or aggregate |
| Moderation audits / audit logs | 24 months | Delete |
| Import runs / reports | 24 months | Delete files + DB rows |
| Application logs | 90 days | Rotate / purge |
| Backups (Cloudron) | Per Cloudron backup policy (document at deploy time) | Restore drills recorded on #3/#11 |

Operators must not use content or mailing imports to send email. Final production imports remain gated by #11 authorization.
