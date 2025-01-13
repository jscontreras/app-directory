'use client';

import { useState, useEffect, useCallback } from 'react';
import { DOMParser } from 'linkedom';
import { Button } from '#/ui/ui/button';

export default function CacheDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const addLog = useCallback((message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  }, []);

  const fetchAPI = useCallback(async () => {
    const start = Date.now();
    const response = await fetch('/cache-headers/test');
    const end = Date.now();
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const timestamp =
      doc.getElementById('timestamp')?.textContent || 'Not found';

    const cacheStatus =
      response.headers.get('x-vercel-cache') ||
      response.headers.get('x-nextjs-cache');
    const age = parseInt(response.headers.get('age') || '0', 10);
    const timeRemaining = Math.max(0, 30 - age);

    addLog(`Request ${requestCount + 1}:`);
    addLog(`  Timestamp: ${timestamp}`);
    addLog(`  Cache: ${cacheStatus}`);
    addLog(`  Time remaining: ${timeRemaining}s`);
    addLog(`  Response time: ${end - start}ms`);
    addLog('');

    setRequestCount((prev) => prev + 1);
  }, [addLog, requestCount]);

  useEffect(() => {
    if (isRunning && !isPaused && requestCount < 30) {
      const timer = setTimeout(fetchAPI, 1000);
      return () => clearTimeout(timer);
    } else if (requestCount >= 30) {
      setIsRunning(false);
    }
  }, [isRunning, isPaused, requestCount, fetchAPI]);

  const startDemo = () => {
    setLogs([]);
    setRequestCount(0);
    setIsRunning(true);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      <Button onClick={startDemo} disabled={isRunning}>
        {isRunning ? 'Running...' : requestCount === 0 ? 'Start Demo' : 'Retry'}
      </Button>
      <Button onClick={togglePause} disabled={!isRunning || requestCount >= 30}>
        {isPaused ? 'Resume' : 'Pause'}
      </Button>
      <div className="rounded-md bg-gray-100 p-4">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {logs.join('\n')}
        </pre>
      </div>
    </div>
  );
}
