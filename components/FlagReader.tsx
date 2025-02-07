'use client';

import { useState, useEffect } from 'react';

type PlainFlag = Record<string, unknown>;

/**
 * Parses nodes and extracts plaintext and encrypted flags.
 */
function searchNodes(nodes: NodeList): {
  plaintext: PlainFlag;
  encrypted: string[];
} {
  return Array.from(nodes).reduce<{
    plaintext: PlainFlag;
    encrypted: string[];
  }>(
    (acc, element) => {
      try {
        if (!element.textContent) return acc;
        const data = JSON.parse(element.textContent) as PlainFlag | string;

        if (typeof data === 'string') {
          acc.encrypted.push(data);
        } else {
          Object.assign(acc.plaintext, data);
        }
      } catch {
        /* empty */
      }
      return acc;
    },
    { plaintext: {}, encrypted: [] },
  );
}

export function useFlagStateObserver() {
  const [flagState, setFlagState] = useState<PlainFlag>({});

  useEffect(() => {
    function processScriptTags() {
      if (Object.entries(flagState).length > 0) {
        return;
      }
      const nodes = document.querySelectorAll('[data-flag-values]');
      const { plaintext } = searchNodes(nodes);
      setFlagState(plaintext);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            processScriptTags();
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // Initial processing of existing script tags
    processScriptTags();

    return () => {
      observer.disconnect();
    };
  }, [flagState]);

  return flagState;
}

export function FlagsReader() {
  const flagState = useFlagStateObserver();

  useEffect(() => {
    Object.entries(flagState).forEach(([key, value]) => {
      // TODO report to Datadog RUM here
      console.log(key, value);
    });
  }, [flagState]);

  return null;
}
