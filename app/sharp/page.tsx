import Image from 'next/image';
import sharp from 'sharp';

async function imageProcessing() {
  const myImgReq = await fetch(
    'https://www.pngall.com/wp-content/uploads/2016/05/Photo-Camera-High-Quality-PNG.png',
  );
  const myImg = await myImgReq.arrayBuffer();
  const processedImage = await sharp(myImg).resize(500, 400).toBuffer();
  return processedImage.toString('base64');
}

export default async function Page() {
  const imgBlob = await imageProcessing();
  return (
    <div>
      <h1 className="m-4 text-xl font-medium text-gray-400/80">
        Testing Sharp
      </h1>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/png;base64, ${imgBlob}`} alt="queso" />
    </div>
  );
}
