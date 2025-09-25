# InternConnect Client

React frontend for the InternConnect multi-tenant SaaS platform.

## Features

- **Modern React Stack**: Vite + React + Tailwind CSS with react-select
- **Role-based Authentication**: JWT-based auth with role guards
- **Responsive Design**: Mobile-first responsive interface with sidebar navigation
- **Real-time Features**: Toast notifications and loading states
- **Form Management**: React Hook Form with Yup validation and react-select dropdowns
- **File Upload**: CV upload with PDF preview functionality
- **Multi-tenant Support**: University-scoped data access
- **Super Admin Panel**: Complete tenant and system management

## User Roles & Access

### Students
- Dashboard with application analytics (static)
- Profile management with CV upload and skills tagging
- Browse and apply to internships with advanced filtering
- Track application status with detailed history
- Receive and manage notifications

### University Liaisons
- Dashboard with university analytics (static)
- Create and manage internship postings with react-select dropdowns
- Review student applications with status management
- Approve/reject student CVs with PDF preview
- Manage applicant status through workflow

### Super Admins
- System dashboard with tenant overview
- Complete tenant (university) management
- System settings configuration
- Cross-tenant visibility and management

## Technology Stack

- **Frontend**: Vite + React 18 + Tailwind CSS 3
- **Routing**: React Router v6 with role-based guards
- **Forms**: React Hook Form + Yup validation + react-select
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Toastify
- **Styling**: Tailwind CSS with @tailwindcss/forms plugin

## Quick Start

From the project root directory:

1. **Environment Setup**
   ```bash
   cp client/.env.example client/.env
   ```

2. **Install Dependencies & Start**
   ```bash
   cd client 
   npm i
   npm run dev
   ```

The client will be available at: http://localhost:5173

## Default Login Credentials

All seeded users use password: `Passw0rd!`

**Students:**
- student1@apiit.lk (APIIT)
- student2@apiit.lk (APIIT)

- student1@sliit.lk (SLIIT)
- student2@sliit.lk (SLIIT)

**Liaisons:**
- liaison@apiit.lk (APIIT)
- liaison@sliit.lk (SLIIT)

**Super Admin:**
- superadmin@internconnect.lk

## Architecture

- **Feature-based Structure**: Organized by user roles and features
- **Component Library**: Reusable UI components with consistent Tailwind styling
- **Service Layer**: Centralized API communication with error handling
- **Route Guards**: Role-based access control with automatic redirects
- **State Management**: React Context for authentication with token persistence

## Key Features

### Enhanced UI/UX
- Responsive sidebar navigation with role-based menu items
- Improved card designs with hover effects and transitions
- Sticky table headers with zebra striping and hover states
- Advanced search and filtering with react-select dropdowns
- Comprehensive loading states and empty state handling
- Toast notifications for all user actions

### Super Admin Capabilities
- Tenant management with CRUD operations
- System settings configuration with form validation
- Dashboard with system health monitoring
- Cross-tenant data visibility and management

### Student Experience
- Advanced internship search with skill and location filters
- CV upload with PDF preview and approval workflow
- Application tracking with detailed status history
- Profile management with skills tagging system

### Liaison Experience
- Internship management with rich form controls
- Applicant review with CV preview and status management
- CV approval queue with feedback system
- Application status workflow management

## Development

- Hot reload enabled for rapid development
- ESLint configured for code quality
- Tailwind CSS with custom component classes
- Responsive design patterns implemented
- Error boundaries and proper error handling