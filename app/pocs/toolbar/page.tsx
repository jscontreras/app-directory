import VercelToolbarAdapter from '#/ui/ui/vercel-toolbar-adapter';
import EmbedPage from './components/EmbedPage';

export default function Page() {
  return (
    <>
      <VercelToolbarAdapter />
      <h1>Testing Iframe Embed</h1>
      <EmbedPage />
    </>
  );
}
