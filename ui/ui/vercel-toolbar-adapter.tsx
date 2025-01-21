'use client';
import { mountVercelToolbar, unmountVercelToolbar } from '@vercel/toolbar';

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/`;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

const settings = {
  scriptHostName: 'https://vercel.live',
  projectId: 'prj_EynROlxBukHxBfAbBsef1XEnykEq',
  branch: 'main',
  deploymentId: 'dpl_Bxu69LNwdvwvqouB7XHa3h5KKSaE',
  ownerId: 'team_qt72u6Ug7jZRH1AY3zX9AkUU',
};

export default function VercelToolbarAdapter() {
  if (typeof window !== 'undefined') {
    (window as any).unmountVercelToolbar = () => {
      removeCookie('flags_site');
      unmountVercelToolbar();
    };
    (window as any).mountVercelToolbarProxied = () => {
      setCookie('flags_site', 'https://svelte.tc-vercel.dev', 30); // Set the cookie for 30 days
      mountVercelToolbar(settings);
    };
  }
  return null;
}
