import { GetStaticProps } from 'next';

interface PageProps {
  timestamp: string;
}

export default function Page({ timestamp }: PageProps) {
  return <h2 id="timestamp">{timestamp}</h2>;
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  // Simulate a 5-second delay
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return {
    props: {
      timestamp,
    },
    // Revalidate every 15 seconds
    revalidate: 15,
  };
};
