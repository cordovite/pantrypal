# PantryPal - Food Bank Management System

A comprehensive web-based food bank management platform designed for small to mid-sized food pantries. PantryPal helps organizations efficiently track inventory, manage donations, schedule distribution events, and generate analytics reports.

## 🌟 Features

### Core Functionality
- **Inventory Management**: Track food items with quantities, categories, and expiration dates
- **Donation Tracking**: Log donations with donor information and item details
- **Distribution Events**: Schedule and manage food distribution events
- **Real-time Alerts**: Notifications for low stock and expiring items
- **Analytics & Reports**: Interactive charts and comprehensive reporting

### Technical Features
- **Secure Authentication**: OpenID Connect integration with Replit Auth
- **Role-based Access**: Support for volunteer and admin user roles
- **Real-time Updates**: Optimistic UI updates with automatic synchronization
- **Responsive Design**: Mobile-friendly interface for field use
- **Data Validation**: Comprehensive input validation and error handling

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Recharts** for data visualization

### Backend
- **Node.js** with Express.js
- **TypeScript** throughout the stack
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** with Neon serverless database
- **OpenID Connect** for authentication
- **Express Sessions** with PostgreSQL storage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Replit account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pantrypal-food-bank-management.git
   cd pantrypal-food-bank-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Configure the following environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SESSION_SECRET` - Secure session encryption key
   - `REPL_ID` - Replit application ID
   - `ISSUER_URL` - OpenID Connect issuer URL

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📊 Project Requirements Fulfillment

### Must-Have Requirements ✅
- [x] View all pantry items
- [x] Add new food items with name, category, and quantity
- [x] Edit and delete existing pantry items
- [x] Persist data using PostgreSQL
- [x] Serve frontend and backend through same port
- [x] Handle errors with meaningful messages
- [x] Secure configuration with environment variables

### Stretch Requirements ✅
- [x] Replit authentication via OpenID Connect
- [x] Role-based access (admin vs viewer)
- [x] Track expiration dates
- [x] Visualize pantry statistics through charts

### Bonus Features 🎯
- [x] Donation management system
- [x] Distribution event scheduling
- [x] Comprehensive audit trails
- [x] Mobile-responsive design
- [x] Real-time notifications

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data access layer
│   ├── db.ts            # Database connection
│   └── replitAuth.ts    # Authentication setup
├── shared/                # Shared code
│   └── schema.ts         # Database schema and types
└── package.json          # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open database studio

## 🛡️ Security Features

- OpenID Connect authentication
- Session-based security with PostgreSQL storage
- Input validation with Zod schemas
- Environment variable configuration
- CSRF protection and secure headers

## 📈 Performance Features

- Server-side rendering optimization
- Database connection pooling
- Optimistic UI updates
- Efficient query caching
- Responsive image handling

## 🤝 Contributing

This project was developed as a comprehensive demonstration of full-stack web development skills, showcasing:

- Modern React patterns and TypeScript usage
- RESTful API design and implementation
- Database design and ORM integration
- Authentication and authorization
- Real-time user interface updates
- Data visualization and reporting

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 About

PantryPal was built to demonstrate comprehensive full-stack development capabilities while solving real-world problems faced by food banks and community organizations. The system showcases modern web development practices, secure authentication, and user-centered design principles.

---

**Built with ❤️ for food banks and community organizations**