import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {everestHeadRegion} from '../src/moneybread/crew-art.js';
import {castIds,crewHeroMarkup} from '../src/characters.js';

test('home crew hero leads with all six named students in the established order',()=>{
 const markup=crewHeroMarkup();
 assert.match(markup,/home-crew-hero/);
 assert.equal((markup.match(/class="money-ops-reference"/g)||[]).length,1);
 assert.match(markup,/width="1280" height="748"/);
 assert.doesNotMatch(markup,/<button/);
 assert.deepEqual(castIds,['jordan','maya','kai','sofia','eli','ruby']);
 for(const name of ['Kanyon','Maya','Everest','Sofia','Zion','Ruby'])assert.match(markup,new RegExp(name));
 assert.match(markup,/Moneybread City/);
});

test('uploaded crew reference is retained unchanged beneath the approved Everest edit',()=>{
 const bytes=readFileSync(new URL('../assets/crew/money-ops-moneybread-city.jpg',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'a1ac7d3dd5c330279336a0b779110b3e594c4bcc6e8753e63c0242d7dae660f4');
});

test('approved Everest portrait is used exactly and other crew assets remain unchanged',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../assets/review/everest-approval.json',import.meta.url)));
 const hash=file=>createHash('sha256').update(readFileSync(new URL('../'+file,import.meta.url))).digest('hex');
 assert.equal(hash('assets/cast/kai.png'),manifest.approvedReferenceSha256);
 assert.equal(hash(manifest.approvedReference),manifest.approvedReferenceSha256);
 for(const [file,sha] of Object.entries(manifest.unchangedCrewAssets))assert.equal(hash(file),sha,file);
});

test('poster update is confined to Everest’s head instead of replacing the other five crew',()=>{
 const markup=crewHeroMarkup();
 assert(markup.includes('money-ops-moneybread-city.jpg'));
 assert(markup.includes('moneybread-city-everest-approved.png'));
 assert(markup.includes('clip-path="url(#everest-head-'));
 assert.deepEqual(everestHeadRegion,{x:504,y:315,width:90,height:90});
});
