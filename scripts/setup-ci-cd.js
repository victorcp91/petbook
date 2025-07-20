#!/usr/bin/env node

/**
 * CI/CD Setup Script for PetBook
 *
 * This script helps configure the CI/CD pipeline by:
 * 1. Validating required environment variables
 * 2. Setting up GitHub secrets (if possible)
 * 3. Configuring external services
 * 4. Testing the setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CI/CD pipeline for PetBook...\n');

// Required secrets for CI/CD
const requiredSecrets = {
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anonymous key',

  // Vercel Deployment
  VERCEL_TOKEN: 'Vercel deployment token',
  VERCEL_ORG_ID: 'Vercel organization ID',
  VERCEL_PROJECT_ID: 'Vercel project ID',

  // External Services
  LHCI_GITHUB_APP_TOKEN: 'Lighthouse CI GitHub app token (optional)',
  SNYK_TOKEN: 'Snyk security token (optional)',
};

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log(
    '❌ .env file not found. Please create one with the following variables:'
  );
  console.log('');

  Object.entries(requiredSecrets).forEach(([key, description]) => {
    console.log(`${key}=your_${key.toLowerCase()}`);
  });

  console.log(
    '\n📝 Create a .env file in the project root with these variables.'
  );
  process.exit(1);
}

// Load environment variables
require('dotenv').config();

console.log('✅ Environment variables loaded\n');

// Validate required secrets
console.log('🔍 Validating required secrets...\n');

let missingSecrets = [];

Object.entries(requiredSecrets).forEach(([key, description]) => {
  const value = process.env[key];
  if (!value) {
    missingSecrets.push(key);
    console.log(`❌ Missing: ${key} - ${description}`);
  } else {
    console.log(`✅ Found: ${key}`);
  }
});

if (missingSecrets.length > 0) {
  console.log(
    '\n❌ Some required secrets are missing. Please add them to your .env file.'
  );
  console.log('Required secrets:');
  missingSecrets.forEach(secret => {
    console.log(`  - ${secret}`);
  });
  process.exit(1);
}

console.log('\n✅ All required secrets are configured!\n');

// Check GitHub CLI availability
try {
  execSync('gh --version', { stdio: 'ignore' });
  console.log('✅ GitHub CLI is available');
} catch (error) {
  console.log(
    '⚠️  GitHub CLI not found. Install it to configure secrets automatically.'
  );
  console.log('   Install: https://cli.github.com/');
}

// Check if we're in a GitHub repository
try {
  const gitRemote = execSync('git remote get-url origin', { encoding: 'utf8' });
  const isGitHubRepo = gitRemote.includes('github.com');

  if (isGitHubRepo) {
    console.log('✅ GitHub repository detected');

    // Extract repository info
    const repoMatch = gitRemote.match(/github\.com[:/]([^/]+\/[^/]+)\.git/);
    if (repoMatch) {
      const repo = repoMatch[1];
      console.log(`📦 Repository: ${repo}`);

      // Check if GitHub CLI is authenticated
      try {
        execSync('gh auth status', { stdio: 'ignore' });
        console.log('✅ GitHub CLI is authenticated');

        // Offer to set up secrets
        console.log('\n🔧 Would you like to set up GitHub secrets? (y/n)');
        process.stdin.once('data', data => {
          const answer = data.toString().trim().toLowerCase();

          if (answer === 'y' || answer === 'yes') {
            setupGitHubSecrets(repo);
          } else {
            console.log(
              '\n📝 Manual setup required. Add these secrets to your GitHub repository:'
            );
            console.log(
              '   Settings > Secrets and variables > Actions > New repository secret'
            );
            console.log('');
            Object.entries(requiredSecrets).forEach(([key, description]) => {
              console.log(`   ${key}: ${description}`);
            });
          }
        });
      } catch (error) {
        console.log('❌ GitHub CLI not authenticated. Run: gh auth login');
        console.log(
          '\n📝 Manual setup required. Add these secrets to your GitHub repository:'
        );
        console.log(
          '   Settings > Secrets and variables > Actions > New repository secret'
        );
      }
    }
  } else {
    console.log(
      '⚠️  Not a GitHub repository. CI/CD will work with other Git providers.'
    );
  }
} catch (error) {
  console.log('⚠️  Could not determine repository type.');
}

// Test local setup
console.log('\n🧪 Testing local setup...\n');

try {
  // Check if dependencies are installed
  console.log('📦 Checking dependencies...');
  execSync('npm list', { stdio: 'ignore' });
  console.log('✅ Dependencies are installed');

  // Check if tests can run
  console.log('🧪 Testing test setup...');
  execSync('npm run test:unit -- --passWithNoTests', { stdio: 'ignore' });
  console.log('✅ Unit tests can run');

  // Check if build works
  console.log('🔨 Testing build...');
  execSync('npm run build', { stdio: 'ignore' });
  console.log('✅ Build works correctly');

  console.log('\n✅ Local setup is working correctly!');
} catch (error) {
  console.log('❌ Local setup test failed:', error.message);
  console.log('Please fix the issues before proceeding with CI/CD setup.');
  process.exit(1);
}

// Setup external services
console.log('\n🔧 Setting up external services...\n');

// Codecov setup
console.log('📊 Codecov Setup:');
console.log('1. Go to https://codecov.io');
console.log('2. Connect your GitHub repository');
console.log('3. Add CODECOV_TOKEN to your GitHub secrets (if needed)');

// Lighthouse CI setup
console.log('\n⚡ Lighthouse CI Setup:');
console.log('1. Go to https://github.com/apps/lighthouse-ci');
console.log('2. Install the Lighthouse CI GitHub App');
console.log('3. Configure it for your repository');

// Snyk setup
console.log('\n🔒 Snyk Setup:');
console.log('1. Go to https://snyk.io');
console.log('2. Connect your GitHub repository');
console.log('3. Add SNYK_TOKEN to your GitHub secrets');

console.log('\n🎉 CI/CD setup is ready!');
console.log('\n📋 Next steps:');
console.log('1. Push your code to GitHub');
console.log('2. Create a pull request to test the pipeline');
console.log('3. Monitor the GitHub Actions tab');
console.log('4. Configure branch protection rules');
console.log('5. Set up deployment environments');

function setupGitHubSecrets(repo) {
  console.log('\n🔧 Setting up GitHub secrets...\n');

  Object.entries(requiredSecrets).forEach(([key, description]) => {
    const value = process.env[key];
    if (value) {
      try {
        execSync(`gh secret set ${key} --body "${value}"`, { stdio: 'ignore' });
        console.log(`✅ Set ${key}`);
      } catch (error) {
        console.log(`❌ Failed to set ${key}: ${error.message}`);
      }
    }
  });

  console.log('\n✅ GitHub secrets configured!');
}
