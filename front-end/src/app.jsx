import * as React from 'react';
import './styles/index.css';
import { createRoot } from 'react-dom/client';
import App from "./components/App.jsx";

const root = createRoot(document.getElementById("app"));
root.render(<App />);