# VaultCraft Wiki

## Project Overview
VaultCraft is a secure, modern SaaS for managing secrets and environment variables across projects and deployments.

## Features
- Secure secrets storage
- Easy integration with deployment pipelines
- User-friendly interface for managing credentials

## Getting Started
Documentation will be expanded as the project evolves. Please contribute any relevant guides or usage notes.

## Technical Architecture

**Frontend**: React, Vite, Tailwind CSS for a fast, modern UI
**Backend**: Node.js/Express, integrated with cloud secrets providers (Doppler, AWS Secrets Manager, Azure Key Vault)
**Database**: PostgreSQL for user and secrets metadata
**Security**: End-to-end encryption, RBAC, audit logging

## Usage Guide

1. **Sign Up & Login**: Create an account and authenticate securely.
2. **Create a Project**: Define environments (dev, staging, prod) and add secrets.
3. **Integrate with CI/CD**: Use provided API keys or CLI to inject secrets into your deployment pipeline.
4. **Manage Secrets**: Add, update, rotate, and revoke secrets with a simple UI.
5. **Audit & Compliance**: View access logs and compliance reports.

## Deployment

- **Cloud Deployment**: Supports Docker, Kubernetes, and NorthFlank for scalable hosting.
- **Environment Variables**: Configure via `.env` or cloud provider settings.
- **Monitoring**: Integrate with Sentry or custom logging for error tracking.

## API Reference

- `POST /api/secrets` — Add a new secret
- `GET /api/secrets` — List secrets
- `PUT /api/secrets/:id` — Update a secret
- `DELETE /api/secrets/:id` — Remove a secret

## Roadmap

- Multi-cloud support
- Advanced access controls
- Automated secret rotation
- Integration with more CI/CD platforms
