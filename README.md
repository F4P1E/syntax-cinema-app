# Syntax Cinema App

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Build Status](https://img.shields.io/badge/build-passing-green.svg)](https://github.com/F4P1E/syntax-cinema-app/actions)  
[![Deploy](https://img.shields.io/badge/deploy-vercel-purple.svg)](https://syntaxcinema.vercel.app)

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running Locally](#running-locally)  
  - [Building for Production](#building-for-production)  
- [Project Structure](#project-structure)  
- [Environment Variables](#environment-variables)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact / Support](#contact--support)

## Project Overview

Syntax Cinema App is a modern web application designed to provide an engaging and intuitive interface for browsing, discovering, and viewing cinema-style content. Built with a modern frontend architecture, this application emphasises high performance, responsive design, and a seamless user experience.

Access the live demo here: [syntaxcinema.vercel.app](https://syntaxcinema.vercel.app)  

## Features

- Browse and search cinema-style content with a sleek UI  
- Interactive and dynamic components using latest web technologies  
- Fully responsive design that adapts to mobile/tablet/desktop  
- Custom styling and theme support  
- Modern routing, middleware, and performance optimisations  

## Tech Stack

| Layer              | Technologies                                             |
|---------------------|----------------------------------------------------------|
| Framework           | Next.js (React-based, SSR/SSG) |
| Language            | TypeScript                 |
| Styling             | CSS Modules / PostCSS                                    |
| Bundler / Tooling   | Vite / Webpack (as used by Next.js)                      |
| Hosting / Deployment| Vercel                         |

> **Note:** This application is written primarily in TypeScript (~90% of codebase).  

## Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)  
- npm or yarn or pnpm (package manager of choice)  
- A modern browser for testing (Chrome, Firefox, Edge, Safari)  

### Installation

1. Clone this repository  
   ```bash
   git clone https://github.com/F4P1E/syntax-cinema-app.git
   cd syntax-cinema-app
````

2. Install dependencies

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Changes will hot-reload as you edit files.

### Building for Production

Generate a production build and start a production server:

```bash
npm run build
npm start
```

or deploy using the chosen hosting provider (e.g., Vercel) following their deployment guide.

## Project Structure

```text
├── app/            # Next.js pages & layouts (app-directory)
├── components/     # Reusable UI components
├── lib/            # Utility functions, data fetching, helpers
├── public/         # Static assets (images, favicon, etc.)
├── scripts/        # Build / deploy / helper scripts
├── styles/         # Global styles, CSS Modules, PostCSS config
├── middleware.ts   # Next.js middleware configuration
├── next.config.mjs # Next.js configuration
├── tsconfig.json   # TypeScript configuration
└── package.json    # Project metadata & dependencies
```

## Environment Variables

If the project uses environment variables (for APIs, secrets, etc.), document them here.
Example:

```
NEXT_PUBLIC_API_URL=https://api.example.com
API_KEY=your_api_key_here
```

Ensure you add `.env.local` to `.gitignore`.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make your changes and ensure tests (if any) pass
4. Commit your work & push your branch
5. Open a Pull Request describing your changes

Please follow the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and abide by the project’s style guidelines.

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact / Support

For questions, feedback, or support, please open an issue on GitHub or contact the maintainer:
**Author**: [F4P1E](https://github.com/F4P1E)
**Email**: [your-email@example.com](mailto:your-email@example.com)

Thank you for using Syntax Cinema App!
