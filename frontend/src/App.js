import './App.css';
import { useCallback, useEffect, useMemo, useState } from 'react';

function computeShowTester() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('testing') === '1';
}

function getTestingUrl() {
  // Backend route is GET /testing (not under /api). If REACT_APP_API_URL points
  // to ".../api", strip it so this works in both local and deployed setups.
  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) return '/testing';

  try {
    const u = new URL(apiUrl);
    u.pathname = u.pathname.replace(/\/api\/?$/, '/');
    return new URL('/testing', u).toString();
  } catch {
    return '/testing';
  }
}

function App() {
  const showTester = useMemo(computeShowTester, []);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const runTest = useCallback(async () => {
    setLoading(true);
    setError('');
    setStatus(null);
    setOutput('');

    try {
      // Per request: GET /testing
      const url = getTestingUrl();
      const res = await fetch(url, { method: 'GET' });
      setStatus(res.status);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        const pretty = JSON.stringify(json, null, 2);
        setOutput(pretty);
        console.log('GET /testing ->', url, res.status, json);
      } else {
        const text = await res.text();
        setOutput(text);
        console.log('GET /testing ->', url, res.status, text);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      console.error('GET /testing failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showTester) runTest();
  }, [showTester, runTest]);

  if (!showTester) {
    return (
      <div className="App">
        <header className="App-header">
          <h2>App Running</h2>
          <p>
            To run the connectivity check, open this page with{' '}
            <code>?testing=1</code> (it will call <code>GET /testing</code> and
            show the output).
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Frontend &lt;-&gt; Backend Test</h2>
        <p>
          This page calls <code>GET /testing</code> and shows the response below.
        </p>

        <button onClick={runTest} disabled={loading}>
          {loading ? 'Testing...' : 'Re-test'}
        </button>

        <div style={{ width: 'min(900px, 92vw)', marginTop: 16, textAlign: 'left' }}>
          <div>
            <strong>Status:</strong> {status === null ? 'n/a' : status}
          </div>
          {error ? (
            <pre style={{ whiteSpace: 'pre-wrap', color: '#ffb3b3' }}>{error}</pre>
          ) : (
            <pre style={{ whiteSpace: 'pre-wrap' }}>{output || '(no body)'}</pre>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
