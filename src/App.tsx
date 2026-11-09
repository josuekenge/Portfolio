import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { InquiryProvider } from './components/Inquiry';
import { Cursor, ScrollManager, TopNav, usePageTitle } from './components/Shell';
import { SYSTEMS } from './data/systems';
import { log } from './lib/log';
import { Home } from './pages/Home';

const Experience = lazy(() => import('./pages/Experience').then((m) => ({ default: m.Experience })));
const Projects = lazy(() => import('./pages/Projects').then((m) => ({ default: m.Projects })));
const SystemPage = lazy(() => import('./pages/SystemPage').then((m) => ({ default: m.SystemPage })));

function NotFound() {
  usePageTitle('Not found | Josue Kenge');
  const logged = useRef(false);
  useEffect(() => {
    if (!logged.current) log.warn('route', `not found: ${window.location.pathname}`);
    logged.current = true;
  }, []);
  return (
    <div className="root notfound">
      <TopNav />
      <main className="pad">
        <div className="lab">404</div>
        <h1 className="h2 mt14">This page didn't ship.</h1>
        <Link className="tl mt24" to="/">Back to home</Link>
      </main>
    </div>
  );
}

function SystemRoute() {
  const { slug } = useParams();
  const system = SYSTEMS.find((s) => s.id === slug);
  return system ? <SystemPage key={system.id} system={system} /> : <NotFound />;
}

function OldInternshipLink() {
  const { slug } = useParams();
  return <Navigate replace to={`/experience#${slug ?? ''}`} />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="root notfound" />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/record" element={<Navigate replace to="/experience" />} />
      <Route path="/experience/:slug" element={<OldInternshipLink />} />
      <Route path="/systems/:slug" element={<SystemRoute />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <InquiryProvider>
        <ScrollManager />
        <Cursor />
        <AppRoutes />
      </InquiryProvider>
    </BrowserRouter>
  );
}
