import {createRoot} from 'react-dom/client';
import App from '@/App';
import '@/index.css';

(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};
const origError = console.error;
console.error = (...args: unknown[]) => {
  origError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

// Suppress WebSocket and HMR errors per environment constraints (HMR disabled in iFrame)
const isViteHmrNoise = (text: string) =>
  text.includes('WebSocket') ||
  text.includes('vite') ||
  text.includes('closed without opened') ||
  text.includes('createWebSocketModuleRunnerTransport') ||
  text.includes('@vite/client');

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const text = `${reason?.message || ''} ${reason?.stack || ''} ${String(reason || '')}`;
  if (isViteHmrNoise(text)) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});

window.addEventListener('error', (event) => {
  const targetIsWs = typeof WebSocket !== 'undefined' && event.target instanceof WebSocket;
  const text = `${event.message || ''} ${event.filename || ''} ${event.error?.stack || ''}`;
  if (targetIsWs || isViteHmrNoise(text)) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
