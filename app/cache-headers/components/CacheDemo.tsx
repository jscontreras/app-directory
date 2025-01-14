'use client';

import { useState, useEffect, useCallback } from 'react';
import { DOMParser } from 'linkedom';
import { Button } from '#/ui/ui/button';

const revalidationPeriod = 15;
interface Log {
  message: string;
  type?: 'timestamp' | 'cache' | 'timeRemaining';
  colorOverride?: string;
}

export default function CacheDemo({ pageUrl }: { pageUrl: string }) {
  const [logs, setLogs] = useState<
    Array<{
      message: string;
      type?: 'timestamp' | 'cache' | 'timeRemaining';
      colorOverride?: string;
    }>
  >([{ message: 'Request details...' }]);
  const [isRunning, setIsRunning] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const addLog = useCallback(
    (
      message: string,
      type?: 'timestamp' | 'cache' | 'timeRemaining',
      colorOverride?: string,
    ) => {
      if (colorOverride) {
        setLogs((prevLogs) => [...prevLogs, { message, type, colorOverride }]);
      } else {
        setLogs((prevLogs) => [...prevLogs, { message, type }]);
      }
    },
    [],
  );

  const fetchAPI = useCallback(async () => {
    const start = Date.now();
    const response = await fetch(`${pageUrl}?${start}`);
    const end = Date.now();
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const timestamp =
      doc.getElementById('timestamp')?.textContent || 'Not found';

    const cacheStatus = response.headers.get('x-vercel-cache');
    const age = parseInt(response.headers.get('age') || '0', 10);
    const timeRemaining =
      revalidationPeriod - age < 0 ? 0 : revalidationPeriod - age;

    addLog(`Request ${requestCount + 1}:`);
    addLog(
      `  Timestamp: ${timestamp}`,
      'timestamp',
      cacheStatus == 'STALE' ? 'text-green-500' : 'text-orange-500',
    );
    addLog(
      `  Cache: ${
        cacheStatus === 'STALE' ? 'STALE (rebuilding page)' : cacheStatus
      }`,
      'cache',
    );
    addLog(`  Age Header: ${age}`);
    addLog(`  : ${timeRemaining}s`, 'timeRemaining');
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

  const renderLogMessage = (log: Log) => {
    switch (log.type) {
      case 'timestamp':
        return (
          <>
            {'  ISR cached content: '}
            <span className={log.colorOverride}>{log.message}</span>
          </>
        );
      case 'cache':
        const color = log.message.includes('STALE')
          ? 'text-green-500'
          : 'text-orange-500';
        return <span className={color}>{log.message}</span>;
      case 'timeRemaining':
        return (
          <span>
            {'  Time to Cache Expiration (revalidation): '}
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
        <Button
          onClick={startDemo}
          disabled={isRunning}
          className="text-purple-600"
        >
          {isRunning
            ? 'Running...'
            : requestCount === 0
            ? 'Start Fetching'
            : 'Retry'}
        </Button>
        <Button
          onClick={togglePause}
          disabled={!isRunning || requestCount >= 30}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      </div>
      <div className="mb-4 rounded-md bg-gray-900 p-4">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index}>{renderLogMessage(log)}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}
