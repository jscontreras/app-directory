import { Card } from '#/ui/ui/card';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="w-full max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Image Optimization Demo
        </h1>

        <Card className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Deep Path Image Test (local)
          </h2>
          <div className="relative flex aspect-[1009/875] w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-6">
            <Image
              src={encodeURI(
                `/products/windows/awning/interior/black/awning-interior-black.webp`,
              )}
              alt="Black Awning Window Interior View"
              width={600}
              height={400}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            This image is stored in a deep folder structure:
            <code className="bg-muted ml-2 rounded px-2 py-1 text-xs">
              /products/windows/awning/interior/black/...
            </code>
          </p>
        </Card>
        <Card className="mt-8 p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Deep Path Image Test (remote)
          </h2>
          <div className="relative flex aspect-[1009/875] w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-6">
            <Image
              src={encodeURI(
                `https://www.andersenwindows.com/-/media/Project/AndersenCorporation/AndersenWindows/AndersenWindows/images/ux-refresh/new-pdps/awning-windows/awning-interior-black-1009x875.png`,
              )}
              alt="Black Awning Window Interior View"
              width={600}
              height={400}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            This image is stored in a deep folder structure:
            <code className="bg-muted ml-2 rounded px-2 py-1 text-xs">
              /products/windows/awning/interior/black/...
            </code>
          </p>
        </Card>
      </div>
    </main>
  );
}
