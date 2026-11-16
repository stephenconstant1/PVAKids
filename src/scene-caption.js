// Readable scene labels without an opaque sticker behind foreground artwork.
export function drawSceneCaption(c,text,x,y,{size=12,color='#fff7dd'}={}){
 c.save();c.font=`bold ${size}px Arial`;c.textAlign='center';c.lineJoin='round';c.lineWidth=3;c.strokeStyle='#163e46';c.shadowColor='#102d4088';c.shadowBlur=3;
 if(typeof c.strokeText==='function')c.strokeText(text,x,y);c.fillStyle=color;c.fillText(text,x,y);c.restore();
}
