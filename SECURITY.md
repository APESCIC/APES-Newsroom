# Security policy

APES Newsroom is currently a private repository. Security reports must stay
inside its authorized collaborator group and must not be posted in GitHub
Discussions, community channels, or an unrelated public repository.

## Report a vulnerability

1. Open a [private repository issue](https://github.com/APESCIC/APES-Newsroom/issues/new?labels=security&assignees=bmurphy-apescic&title=%5BSECURITY%5D%20).
2. Apply the `security` label and assign `bmurphy-apescic` if the prefilled
   values are not retained.
3. Describe the affected surface, observed impact, and safe reproduction steps.
4. Remove credentials, tokens, session values, personal data, private contact
   data, production exports, logs, and private infrastructure details before
   submitting. State that material was removed rather than redacting it inline.
5. Do not test against production, send live campaigns, change DNS, or access
   data that you are not authorized to use.

Repository administrators will triage the report privately, agree on a safe
validation path, and track remediation without publishing exploit details.

## Visibility boundary

This process is private only because the repository and its issues are private.
GitHub repository security advisories and private vulnerability reporting are
available for public repositories, not this private-repository workflow. Before
changing repository visibility, APES CIC must replace this issue-based route
with a suitable private intake channel and review every existing `security`
issue for disclosure risk.

See GitHub's documentation on
[repository security advisories](https://docs.github.com/en/code-security/concepts/vulnerability-reporting-and-management/repository-security-advisories).
