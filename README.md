A modern, AI-powered task management application built with React, TypeScript, and Supabase. This application helps users manage their tasks efficiently while providing intelligent insights and analytics.

## Features

- 📋 Intuitive task management interface
- 🤖 AI-powered insights for better productivity
- 📊 Interactive dashboard with task statistics
- 🎯 Task filtering and organization
- 🔐 Secure authentication using Supabase
- 📱 Responsive design for all devices
- 🎨 Beautiful UI components using Shadcn/ui

## Tech Stack

- **Frontend Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Backend/Authentication:** Supabase
- **State Management:** React Context
- **Charts/Analytics:** Custom chart components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Bun package manager
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

- `/src` - Application source code
  - `/components` - React components
  - `/contexts` - React context providers
  - `/hooks` - Custom React hooks
  - `/integrations` - Third-party service integrations
  - `/lib` - Utility functions
  - `/pages` - Application pages/routes
  - `/services` - Service layer (AI services, etc.)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
