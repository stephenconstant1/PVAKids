import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {spawn} from 'node:child_process';
const root=process.cwd();
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const server=http.createServer(async(req,res)=>{
 try{
  let path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  if((await stat(path)).isDirectory())path=resolve(path,'index.html');
  res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');
  res.end(await readFile(path));
 }catch{res.writeHead(404);res.end('File not found');}
});
await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok);});
const address=server.address();
const child=spawn(process.execPath,[process.argv[2]||'tests/browser.cjs'],{stdio:'inherit',env:{...process.env,MONEY_OPS_URL:`http://127.0.0.1:${address.port}`}});
const code=await new Promise(ok=>{child.once('error',error=>{console.error(error);ok(1);});child.once('exit',code=>ok(code??1));});
server.closeAllConnections();server.close();process.exitCode=code;
