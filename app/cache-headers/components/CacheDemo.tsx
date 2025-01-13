'use client';

import { useState, useEffect, useCallback } from 'react';
import { DOMParser } from 'linkedom';
import { Button } from '#/ui/ui/button';

export default function CacheDemo() {
  const [logs, setLogs] = useState<
    Array<{ message: string; type?: 'timestamp' | 'cache' | 'timeRemaining' }>
  >([]);
  const [isRunning, setIsRunning] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const addLog = useCallback(
    (message: string, type?: 'timestamp' | 'cache' | 'timeRemaining') => {
      setLogs((prevLogs) => [...prevLogs, { message, type }]);
    },
    [],
  );

  const fetchAPI = useCallback(async () => {
    const start = Date.now();
    const response = await fetch('/cache-headers/test');
    const end = Date.now();
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const timestamp =
      doc.getElementById('timestamp')?.textContent || 'Not found';

    const cacheStatus = response.headers.get('x-vercel-cache');
    const age = parseInt(response.headers.get('age') || '0', 10);
    console.log('age', age);
    const timeRemaining = age - 20 < 0 ? 0 : age - 20;

    addLog(`Request ${requestCount + 1}:`);
    addLog(`  Timestamp: ${timestamp}`, 'timestamp');
    addLog(`  Cache: ${cacheStatus}`, 'cache');
    addLog(`  Time remaining: ${timeRemaining}s`, 'timeRemaining');
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

  const renderLogMessage = (log: {
    message: string;
    type?: 'timestamp' | 'cache' | 'timeRemaining';
  }) => {
    switch (log.type) {
      case 'timestamp':
        return <span className="text-red-500">{log.message}</span>;
      case 'cache':
        return <span className="text-orange-500">{log.message}</span>;
      case 'timeRemaining':
        return (
          <span>
            Time remaining:{' '}
            <span className="text-blue-500">{log.message.split(': ')[1]}</span>
          </span>
        );
      default:
        return log.message;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button onClick={startDemo} disabled={isRunning}>
          {isRunning
            ? 'Running...'
            : requestCount === 0
            ? 'Start Demo'
            : 'Retry'}
        </Button>
        <Button
          onClick={togglePause}
          disabled={!isRunning || requestCount >= 30}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      </div>
      <div className="rounded-md bg-black p-4">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index}>{renderLogMessage(log)}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}
