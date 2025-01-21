'use client';
import { mountVercelToolbar, unmountVercelToolbar } from '@vercel/toolbar';

const settings = {
  scriptHostName: 'https://vercel.live',
  projectId: 'prj_EynROlxBukHxBfAbBsef1XEnykEq',
  branch: 'main',
  deploymentId: 'dpl_Bxu69LNwdvwvqouB7XHa3h5KKSaE',
  ownerId: 'team_qt72u6Ug7jZRH1AY3zX9AkUU',
};

export default function VercelToolbarAdapter() {
  if (typeof window !== 'undefined') {
    (window as any).unmountVercelToolbar = unmountVercelToolbar;
    (window as any).mountVercelToolbar = () => {
      mountVercelToolbar(settings);
    };
  }
  return null;
}
