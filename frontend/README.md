# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the frontend directory based on the `.env.example` template.

Key environment variables:
- `VITE_API_URL`: Backend URL for local development (defaults to http://localhost:5000)
- `VITE_BACKEND_URL`: Backend URL for production deployments (used in Render)

Example `.env` file:
```
VITE_API_URL=http://localhost:5000
VITE_BACKEND_URL=https://your-production-backend-url.com
```

## Deployment

To deploy this frontend application, make sure you have updated all dependencies and then run:

```bash
npm install --legacy-peer-deps
npm run build
```

The build output will be in the `dist` folder, which can be deployed to any static hosting service like Vercel, Netlify, or Render.

For Render deployment, the platform will automatically run the build command specified in your package.json.

## Clean Installation

If you encounter dependency issues (especially with Rollup modules), perform a clean installation:

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install dependencies with legacy peer deps flag
npm install --legacy-peer-deps

# Build the project
npm run build
```

This approach ensures that all dependencies are installed fresh without any cached or conflicting modules.