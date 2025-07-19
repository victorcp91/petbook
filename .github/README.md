# CI/CD Pipeline Documentation

This directory contains GitHub Actions workflows for the PetBook monorepo.

## Workflows

### 1. CI (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**

- **Test**: Runs type checking, linting, and tests
- **Build**: Builds all applications and uploads artifacts
- **Security**: Runs security audits and vulnerability scans

### 2. Deploy to Staging (`deploy-staging.yml`)

Automatically deploys to staging environment on pushes to `develop` branch.

**Features:**

- Automated testing before deployment
- Vercel deployment for frontend
- Supabase migrations for backend
- Environment-specific configuration

### 3. Deploy to Production (`deploy-production.yml`)

Deploys to production environment on release publication.

**Features:**

- Manual approval required
- Release-based deployment
- Production environment protection
- Deployment logging

### 4. Dependency Update (`dependency-update.yml`)

Automatically checks for dependency updates weekly.

**Features:**

- Scheduled runs (Mondays at 9 AM UTC)
- Creates PRs for updates
- Security-focused updates

### 5. Code Quality (`code-quality.yml`)

Runs comprehensive code quality checks.

**Features:**

- Formatting checks
- Linting
- Type checking
- Bundle analysis
- PR comments with results

## Required Secrets

### Vercel Deployment

- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

### Supabase

- `SUPABASE_ACCESS_TOKEN`: Supabase access token
- `SUPABASE_DB_PASSWORD`: Database password
- `SUPABASE_STAGING_PROJECT_REF`: Staging project reference
- `SUPABASE_PRODUCTION_PROJECT_REF`: Production project reference

### Security

- `SNYK_TOKEN`: Snyk security token (optional)

### Notifications

- `SLACK_WEBHOOK_URL`: Slack webhook for notifications (optional)

## Environment Configuration

### Staging Environment

- Branch: `develop`
- Auto-deploy: Yes
- Manual approval: No

### Production Environment

- Branch: `main`
- Auto-deploy: No (release-based)
- Manual approval: Yes

## Local Development

To test workflows locally:

```bash
# Install act (GitHub Actions runner)
brew install act

# Run a specific workflow
act -W .github/workflows/ci.yml

# Run with secrets
act -W .github/workflows/ci.yml --secret-file .secrets
```

## Troubleshooting

### Common Issues

1. **Build failures**: Check Node.js version compatibility
2. **Test failures**: Ensure all dependencies are installed
3. **Deployment failures**: Verify environment secrets are set
4. **Security scan failures**: Check for vulnerable dependencies

### Debugging

- Check workflow logs in GitHub Actions
- Use `act` for local testing
- Verify secret permissions
- Check environment protection rules

## Best Practices

1. **Branch Protection**: Enable branch protection on `main`
2. **Required Checks**: Require CI to pass before merging
3. **Environment Protection**: Use environment protection rules
4. **Secret Rotation**: Regularly rotate sensitive secrets
5. **Monitoring**: Set up alerts for failed deployments
