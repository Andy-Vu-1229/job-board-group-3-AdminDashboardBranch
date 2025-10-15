# DawgsConnect - Student Job Board

A comprehensive web application designed for MIS (Management Information Systems) students at the University of Georgia to discover and apply for job opportunities. The platform connects students with internships, full-time positions, and contract work posted by administrators and company representatives.

## Project Overview

### Key Features

- **Simple Authentication**: Email/password authentication with role-based access (Student, Company Rep, Admin)
- **Job Management**: Create, view, and manage job postings with detailed information
- **Role-Based Dashboards**: Customized experiences for different user types

### User Roles

- **Students**: Browse and apply for job opportunities, filter by preferences
- **Company Representatives**: Post job opportunities, manage company listings
- **Administrators**: Oversee all job postings, manage user accounts, moderate content

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- AWS Account (for deployment)
- AWS Amplify CLI (for backend management)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-job-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser to `http://localhost:5173`
   - Create an account or use test credentials


## Architecture Overview

### Frontend (React + TypeScript + Vite)

- **Framework**: React 18 with TypeScript
- **Routing**: React Router for client-side navigation
- **Styling**: CSS modules
- **State Management**: React Context for authentication and global state

### Backend (AWS Amplify Gen 2)

- **Database**: Amazon DynamoDB with GraphQL API
- **API**: AWS AppSync for real-time GraphQL operations
- **Authentication**: Email/password stored in DynamoDB
- **Authorization**: API Key-based access for simplified development
- **Hosting**: AWS Amplify Hosting for automatic deployments

## 🔧 Backend Configuration

### Amplify Setup

The project uses AWS Amplify Gen 2 for backend services:

```typescript
// amplify/data/resource.ts - Defines the GraphQL schema
// amplify/backend.ts - Configures the backend stack
```

### GraphQL Operations

The application uses a custom GraphQL service layer (`src/services/graphqlService.ts`) that provides:
- User authentication and management
- Job posting CRUD operations
- Search and filtering capabilities
- Real-time data synchronization

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── JobCard.tsx     # Individual job posting display
│   ├── JobFilters.tsx  # Search and filter controls
│   └── Navigation.tsx  # Main navigation bar
├── pages/              # Main application pages
│   ├── SignInPage.tsx          # User authentication
│   ├── CreateAccountPage.tsx   # User registration
│   ├── StudentDashboard.tsx    # Job browsing interface
│   └── CreateJobPage.tsx       # Job posting creation
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication state management
├── services/           # External service integrations
│   └── graphqlService.ts # AWS AppSync GraphQL client
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks

amplify/
├── data/
│   └── resource.ts     # GraphQL schema definition
└── backend.ts          # Amplify backend configuration
```

## Deployment

### AWS Amplify Deployment

1. **Connect to Amplify Console**
   - Link your GitHub repository to AWS Amplify
   - Configure build settings (auto-detected for Vite)

2. **Build Configuration**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```

## Development Notes

### Authentication System

The application uses a simplified authentication system for development purposes:
- **No email verification** required
- **Plain text passwords** stored in DynamoDB
- **Session management** via localStorage
- **Role-based access** control throughout the application

### API Integration

- **GraphQL Client**: Custom service layer wraps AWS AppSync
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Type Safety**: Full TypeScript integration with generated types
- **Real-time Updates**: Automatic data synchronization

### Styling Approach

- **CSS Modules**: Component-scoped styling
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation
- **Professional Theme**: Clean, academic-focused design

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT-0 License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or support regarding this project:
- Check the [AWS Amplify Documentation](https://docs.amplify.aws/)
- Review the [React Documentation](https://react.dev/)
- Open an issue in this repository

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.