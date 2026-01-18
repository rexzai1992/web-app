import { LayoutType, Sticker, LAYOUT_CONFIG } from '../types';
import { SVG_STRINGS } from '../components/AssetLibrary';

const loadImg = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const loadSvgString = (svgString: string): Promise<HTMLImageElement> => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    return loadImg(url);
};

export const generateComposite = async (
  layout: LayoutType,
  photos: string[],
  stickers: Sticker[],
  frameColor: string = '#ffffff'
): Promise<string> => {
  const config = LAYOUT_CONFIG[layout];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = config.width;
  canvas.height = config.height;

  // 1. Draw Background (User Selected Frame Color)
  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw Photos
  if (layout === 'postcard') {
    // Minimalist Postcard Layout: Maximized Photo Size
    const topMargin = 40;
    const bottomMargin = 40; 
    const sideMargin = 20;   
    const spacing = 20;      

    // Calculate dimensions
    const availableHeight = canvas.height - topMargin - bottomMargin - (spacing * 2);
    const photoH = availableHeight / 3;
    
    // Check if width constraint is hit (16:9 aspect)
    let photoW = photoH * (16/9);
    
    // If photos are too wide for canvas, constrain by width
    const maxW = canvas.width - (sideMargin * 2);
    if (photoW > maxW) {
        photoW = maxW;
    }
    
    // Center horizontally
    const centerX = canvas.width / 2;
    const startY = topMargin;

    for (let i = 0; i < photos.length; i++) {
        if (!photos[i]) continue;
        const img = await loadImg(photos[i]);
        
        const yPos = startY + (i * (photoH + spacing));
        const xPos = centerX - (photoW / 2);

        // Simple aesthetic drop shadow for depth
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 10;
        
        // Draw Image directly (clean edge)
        ctx.drawImage(img, xPos, yPos, photoW, photoH);
        ctx.restore();
    }

  } else if (layout === 'strips') {
    // Edge-to-edge printing style
    const marginX = 0; 
    const marginY = 0; 
    
    // Seamless strips (no gap between the two 2x6 layouts on the 4x6 paper)
    const gapBetweenStrips = 0;
    
    const totalW = canvas.width - (marginX * 2);
    const totalH = canvas.height - (marginY * 2);
    
    const stripWidth = (totalW - gapBetweenStrips) / 2;
    const stripHeight = totalH;
    
    const strip1X = marginX;
    const strip2X = marginX + stripWidth + gapBetweenStrips;
    
    // Draw Strip Backgrounds
    ctx.fillStyle = frameColor; 
    ctx.fillRect(strip1X, marginY, stripWidth, stripHeight);
    ctx.fillRect(strip2X, marginY, stripWidth, stripHeight);

    // Side padding: 20px (per side of the photo)
    const paddingX = 20; 
    const photoW = stripWidth - (paddingX * 2);
    
    // Classic 4:3 Aspect Ratio for photos
    const photoH = photoW * (3/4); 

    // Tighter vertical gap between photos
    const gapY = 15; 
    const totalPhotoH = photoH * 4;
    const totalGapH = gapY * 3;
    const contentH = totalPhotoH + totalGapH;
    
    // Center the content block vertically in the strip
    const startY = (stripHeight - contentH) / 2;

    for (let i = 0; i < photos.length; i++) {
         if (!photos[i]) continue;
         const img = await loadImg(photos[i]);
         
         const yPos = startY + (i * (photoH + gapY));
         
         // Apply to both strips
         ctx.drawImage(img, strip1X + paddingX, yPos, photoW, photoH);
         ctx.drawImage(img, strip2X + paddingX, yPos, photoW, photoH);
    }
  }

  // 3. Draw Stickers
  for (const sticker of stickers) {
      const svgStr = SVG_STRINGS[sticker.type];
      const img = await loadSvgString(svgStr);
      
      // Base Size 150
      const sWidth = 150 * sticker.scale; 
      const sHeight = 150 * sticker.scale; 
      
      const xPos = (sticker.x / 100) * canvas.width;
      const yPos = (sticker.y / 100) * canvas.height;

      ctx.save();
      ctx.translate(xPos, yPos);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 5;
      ctx.drawImage(img, -sWidth / 2, -sHeight / 2, sWidth, sHeight);
      ctx.restore();
  }

  return canvas.toDataURL('image/png');
};