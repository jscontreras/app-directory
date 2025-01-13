export const revalidate = 20; // revalidate every 20 seconds

export default async function Page() {
  // Simulate a 5-second delay
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const timestamp = new Date().toISOString();
  return <h2 id="timestamp">{timestamp}</h2>;
}
