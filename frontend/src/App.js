import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  async function runTest() {
    setLoading(true);
    setError('');
    setStatus(null);
    setOutput('');

    try {
      // Per request: GET /testing
      const res = await fetch('/testing', { method: 'GET' });
      setStatus(res.status);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        const pretty = JSON.stringify(json, null, 2);
        setOutput(pretty);
        console.log('GET /testing ->', res.status, json);
      } else {
        const text = await res.text();
        setOutput(text);
        console.log('GET /testing ->', res.status, text);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      console.error('GET /testing failed:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Frontend ↔ Backend Test</h2>
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
