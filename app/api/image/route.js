import sharp from 'sharp';

async function imageProcessing() {
  const myImgReq = await fetch(
    'https://www.pngall.com/wp-content/uploads/2016/05/Photo-Camera-High-Quality-PNG.png',
  );
  const myImg = await myImgReq.arrayBuffer();
  const processedImage = await sharp(myImg).resize(500, 500).toBuffer();
  return processedImage;
}

export async function GET(req, res) {
  try {
    const processedImage = await imageProcessing();
    const base64Data = processedImage.toString('base64');
    return Response.json({
      b64Data: base64Data,
      contentType: 'image/png',
      extension: 'png',
    });
  } catch (error) {
    console.log(Response);
    return Response.json({ error: 'ok' });
  }
}
