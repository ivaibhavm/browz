export const reactBasePrompt = `<Artifact id=\"project-import\" title=\"Project Files\"><Action type=\"file\" filePath=\"src/main.jsx\">import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
</Action><Action type=\"file\" filePath=\"src/App.jsx\">export default function App() {
  return (
    <div className=\"min-h-screen flex items-center justify-center bg-gray-100\">
      <p className=\"text-gray-700 text-lg\">
        Start prompting (or editing) to see magic happen :)
      </p>
    </div>
  );
}
</Action><Action type=\"file\" filePath=\"src/index.css\">@tailwind base;
@tailwind components;
@tailwind utilities;
</Action><Action type=\"file\" filePath=\"index.html\"><!doctype html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>Browz App</title>
  </head>
  <body>
    <div id=\"root\"></div>
    <script type=\"module\" src=\"/src/main.jsx\"></script>
  </body>
</html>
</Action><Action type=\"file\" filePath=\"tailwind.config.js\">/** @type {import('tailwindcss').Config} */
export default {
  content: [
    \"./index.html\",
    \"./src/**/*.{js,ts,jsx,tsx}\",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
</Action><Action type=\"file\" filePath=\"postcss.config.js\">export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
</Action><Action type=\"file\" filePath=\"package.json\">{
  \"name\": \"browz-template\",
  \"private\": true,
  \"version\": \"0.0.0\",
  \"type\": \"module\",
  \"scripts\": {
    \"dev\": \"vite\"
  },
  \"dependencies\": {
    \"react\": \"^18.3.1\",
    \"react-dom\": \"^18.3.1\"
  },
  \"devDependencies\": {
    \"vite\": \"^5.4.2\",
    \"tailwindcss\": \"^3.4.1\",
    \"postcss\": \"^8.4.35\",
    \"autoprefixer\": \"^10.4.18\"
  }
}
</Action><Action type=\"file\" filePath=\"vite.config.js\">export default {
  server: {
    port: 5173,
    host: true
  }
};
</Action><Action type=\"shell\">npm install && npm run dev</Action></Artifact>`;