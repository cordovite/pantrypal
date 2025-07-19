# PantryPal - Food Bank Management System

## Overview

PantryPal is a comprehensive food bank management system built with a modern web stack. It helps food banks track inventory, manage donations, schedule distributions, and generate reports. The application features a clean, responsive interface with role-based access control and real-time data updates.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API**: RESTful API with JSON responses

### Database Design
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Relational design with proper foreign keys and indexes
- **Migrations**: Drizzle Kit for schema migrations
- **Connection**: Neon serverless PostgreSQL (with WebSocket support)

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions table
- **User Management**: User profiles with roles (volunteer, admin)
- **Route Protection**: Middleware-based authentication checks

### Inventory Management
- **Features**: Add, edit, delete inventory items
- **Categorization**: Food categories (Canned Goods, Fresh Produce, etc.)
- **Stock Tracking**: Quantity monitoring with low stock alerts
- **Expiration Dates**: Automatic expiring items notifications
- **Search & Filter**: Multi-criteria filtering and sorting

### Donations Tracking
- **Types**: Food donations, monetary donations, other donations
- **Donor Information**: Contact details and donation history
- **Item Tracking**: Detailed donation items with quantities
- **Status Management**: Pending, received, processed donations

### Distribution Events
- **Event Planning**: Schedule distribution events
- **Capacity Management**: Maximum families and registration tracking
- **Location Tracking**: Event venues and logistics
- **Status Workflow**: Scheduled, in-progress, completed events

### Reporting & Analytics
- **Dashboard**: Real-time statistics and metrics
- **Activity Logging**: Comprehensive audit trail
- **Charts**: Visual data representation with Recharts
- **Export**: Data export capabilities

## Data Flow

### Client-Server Communication
1. **API Requests**: RESTful endpoints with standard HTTP methods
2. **Authentication**: Session-based with secure cookies
3. **Data Fetching**: TanStack Query for caching and synchronization
4. **Real-time Updates**: Optimistic updates with query invalidation

### Database Operations
1. **Transactions**: Atomic operations for data consistency
2. **Relationships**: Foreign key constraints for data integrity
3. **Indexing**: Optimized queries with database indexes
4. **Validation**: Zod schemas for runtime type checking

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **TypeScript**: Full TypeScript support across the stack
- **Build Tools**: Vite, ESBuild for production builds

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Data Management
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **Date-fns**: Date manipulation utilities

### Backend Services
- **Express.js**: Web framework
- **Drizzle ORM**: Database operations
- **Neon Database**: Serverless PostgreSQL
- **Connect-PG-Simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon serverless PostgreSQL or local PostgreSQL
- **Authentication**: Replit Auth (requires Replit environment)

### Production Deployment
- **Build Process**: Vite build with static asset optimization
- **Server**: Express.js with compiled TypeScript
- **Database**: Managed PostgreSQL instance
- **Session Storage**: PostgreSQL-backed sessions

### Environment Configuration
- **Database URL**: PostgreSQL connection string
- **Session Secret**: Secure session encryption key
- **OIDC Configuration**: Replit Auth settings
- **Node Environment**: Development/production mode switching

### Alternative Deployment Options
- **SQLite Conversion**: Instructions provided for local file-based database
- **Local PostgreSQL**: Setup guide for local development
- **Docker**: Containerization ready (database and app separation)

## Changelog

- July 19, 2025. Fixed distribution event date validation - backend now properly converts datetime-local string to Date object
- July 19, 2025. Fixed reports page - removed non-working export buttons, added empty state messages for charts, fixed bullet points
- January 18, 2025. Fixed critical distribution event date validation bug - converted string to Date object properly
- January 18, 2025. Fixed time display formatting to show correct AM/PM times instead of incorrect timezone conversion
- January 18, 2025. Updated branding from "Food Bank" to "PantryPal" in sidebar
- January 18, 2025. Redeployed application due to previous deployment not reflecting changes
- July 05, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.