import ParamsDisplay from './components/ParamsDisplay';

export default async function Page() {
  return (
    <>
      <h1 className="text-xl">{'>> Hello World!!'}</h1>
      <ParamsDisplay />
    </>
  );
}

// Make sure Next accept this page as static (DNS caching)
export const dynamic = 'force-static';
