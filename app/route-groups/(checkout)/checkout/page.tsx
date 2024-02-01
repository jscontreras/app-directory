import Image from 'next/image';

function ImageProcessing({ image }: { image: string }) {
  const processedImage = sharp(image).resize(500, 500).jpeg().toBuffer();

  return <Image src={processedImage} alt="Testing Sharp" />;
}

export default function Page() {
  return (
    <>
      <ImageProcessing image={'./vercel_logo.jpg'} />
      <h1 className="text-xl font-medium text-gray-400/80">Checkout</h1>;
    </>
  );
}
