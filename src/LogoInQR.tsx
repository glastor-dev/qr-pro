import { useEffect, useState } from 'react';

type Crop = {
  minX: number;
  minY: number;
  cropW: number;
  cropH: number;
  imgW: number;
  imgH: number;
};

type LogoInQRProps = {
  size?: number;
  logo?: string;
  qrSize?: number;
};

export default function LogoInQR({ size = 64, logo, qrSize = 256 }: LogoInQRProps) {
  const [crop, setCrop] = useState<Crop | null>(null);

  useEffect(() => {
    if (!logo) return;

    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.drawImage(img, 0, 0);
      const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      let minX = tempCanvas.width,
        minY = tempCanvas.height,
        maxX = 0,
        maxY = 0;

      for (let y = 0; y < tempCanvas.height; y++) {
        for (let x = 0; x < tempCanvas.width; x++) {
          const alpha = imgData.data[(y * tempCanvas.width + x) * 4 + 3];
          if (alpha > 16) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (minX > maxX || minY > maxY) {
        minX = 0;
        minY = 0;
        maxX = tempCanvas.width - 1;
        maxY = tempCanvas.height - 1;
      }

      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;
      setCrop({ minX, minY, cropW, cropH, imgW: img.width, imgH: img.height });
    };

    img.src = logo;
  }, [logo]);

  if (!logo || !crop) return null;

  const logoSize = size;
  const scale = Math.min(logoSize / crop.cropW, logoSize / crop.cropH);
  const logoW = crop.cropW * scale;
  const logoH = crop.cropH * scale;
  const x = qrSize / 2 - logoW / 2;
  const y = qrSize / 2 - logoH / 2;

  return (
    <g>
      <defs>
        <clipPath id="logo-clip">
          <circle cx={qrSize / 2} cy={qrSize / 2} r={logoSize / 2} />
        </clipPath>
      </defs>
      <circle
        cx={qrSize / 2}
        cy={qrSize / 2}
        r={logoSize / 2}
        fill="white"
        style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.08))' }}
      />
      <image
        href={logo}
        x={x - crop.minX * scale}
        y={y - crop.minY * scale}
        width={crop.imgW * scale}
        height={crop.imgH * scale}
        clipPath="url(#logo-clip)"
        style={{ pointerEvents: 'none' }}
      />
    </g>
  );
}
