import * as React from 'react';
import './styles/index.css';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById("app"));
root.render(<h2>Hello from React!</h2>);