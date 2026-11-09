import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { installGlobalLogging, log } from './lib/log';
import './styles.css';

installGlobalLogging();
const host = document.getElementById('app');
if (host) createRoot(host).render(<StrictMode><App /></StrictMode>);
else log.error('app', 'mount node #app is missing');
