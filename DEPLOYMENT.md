# Amplify Gen 2 Deployment Guide

## Prerequisites

1. **AWS Account**: Ensure you have an active AWS account
2. **AWS CLI**: Install and configure AWS CLI with appropriate credentials
3. **Amplify CLI**: Already installed via `@aws-amplify/backend-cli`

## Deployment Steps

### 1. Configure AWS Credentials

If you haven't configured AWS credentials yet, run:

```bash
# Configure AWS profile
npx ampx configure profile

# Or use AWS CLI to configure credentials
aws configure
```

### 2. Deploy to AWS Sandbox

Deploy the GraphQL API and DynamoDB backend:

```bash
# Deploy once (for testing)
npx ampx sandbox --once

# Or deploy with watch mode (for development)
npx ampx sandbox
```

### 3. Verify Deployment

After successful deployment:

1. **Check AWS Console**: 
   - Go to AWS AppSync to see your GraphQL API
   - Go to DynamoDB to see your tables with GSI indexes

2. **Test GraphQL API**:
   - Use the GraphQL playground in AWS AppSync console
   - Test queries and mutations

3. **Verify Tables and Indexes**:
   - `User` table with `byRole` GSI
   - `JobPosting` table with `byPostedBy`, `byStatus`, `byJobType`, and `byIndustry` GSIs

### 4. Generated Files

After deployment, you should see:
- `amplify_outputs.json` - Contains API endpoints and configuration
- Updated AWS resources in your account

## Schema Overview

### User Model
- Primary Key: `cognitoId`
- GSI: `byRole` for role-based queries
- Relationships: `hasMany JobPosting`

### JobPosting Model  
- Primary Key: Auto-generated ID
- Foreign Key: `postedBy` (references User.cognitoId)
- GSIs: `byPostedBy`, `byStatus`, `byJobType`, `byIndustry`
- Relationships: `belongsTo User`

### ContactMethod Custom Type
- `type`: EMAIL or CAREERS_PAGE
- `value`: Email address or URL

## Troubleshooting

### Credential Issues
```bash
# Check AWS credentials
aws sts get-caller-identity

# Configure new profile
npx ampx configure profile --name myprofile
npx ampx sandbox --profile myprofile
```

### Deployment Failures
- Check AWS CloudFormation console for stack events
- Ensure proper IAM permissions
- Verify region settings