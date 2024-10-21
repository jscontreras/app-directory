export default async function Page() {
  return <h1>Hello World!!</h1>;
}

// Make sure Next accept this page as static (DNS caching)
export const dynamic = 'force-static';
