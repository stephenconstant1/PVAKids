import {installedRunnerArt} from './runner-art-manifest.js';

// Only build-verified local files are requested. Existing vector art remains the fallback.
export class RunnerArtwork {
 constructor(paths=installedRunnerArt,ImageType=globalThis.Image){this.paths=paths;this.images=new Map();this.ImageType=ImageType;}
 image(kind){const path=this.paths[kind];if(!path||!this.ImageType)return null;
  if(!this.images.has(kind)){const image=new this.ImageType();image.src=new URL('../'+path,import.meta.url).href;this.images.set(kind,image);}
  const image=this.images.get(kind);return image.complete&&image.naturalWidth>0&&image.naturalHeight>0?image:null;
 }
 draw(c,kind,x,y,width,height=width){const image=this.image(kind);if(!image)return false;
  const scale=Math.min(width/image.naturalWidth,height/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;
  c.drawImage(image,x+(width-w)/2,y+(height-h)/2,w,h);return true;
 }
 // The artwork's landing line is metadata; it never changes the collision surface.
 platform(c,x,landingY,width){const image=this.image('platform');if(!image)return false;const h=width*image.naturalHeight/image.naturalWidth;c.drawImage(image,x,landingY-h*.39,width,h);return true;}
 vine(c,x,top,width,height){const image=this.image('vine');if(!image)return false;const tileHeight=width*image.naturalHeight/image.naturalWidth;
  c.save();c.beginPath();c.rect(x,top,width,height);c.clip();for(let y=top;y<top+height;y+=tileHeight)c.drawImage(image,x,y,width,tileHeight);c.restore();return true;
 }
}
export const runnerArtwork=new RunnerArtwork();
export function runnerArtPath(kind){return installedRunnerArt[kind]||null;}
