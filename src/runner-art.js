import {installedRunnerArt,runnerRouteArt} from './runner-art-manifest.js?v=46.33';

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
 platform(c,x,landingY,width){const image=this.image('platform');if(!image)return false;const m=runnerRouteArt.platform,scale=width/(m.walkableRight-m.walkableLeft);c.drawImage(image,x-m.walkableLeft*scale,landingY-m.landingY*scale,m.width*scale,m.height*scale);return true;}
 vine(c,x,top,width,height){const image=this.image('vine');if(!image)return false;const [sx,sy,sw,sh]=runnerRouteArt.vine.sourceRect,drawWidth=height*sw/sh;
  c.drawImage(image,sx,sy,sw,sh,x+(width-drawWidth)/2,top,drawWidth,height);return true;
 }
}
export const runnerArtwork=new RunnerArtwork();
export function runnerArtPath(kind){return installedRunnerArt[kind]||null;}
