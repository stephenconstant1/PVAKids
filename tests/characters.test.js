import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
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

test('landing reference is the unchanged uploaded crew image',()=>{
 const bytes=readFileSync(new URL('../assets/crew/money-ops-moneybread-city.jpg',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'a1ac7d3dd5c330279336a0b779110b3e594c4bcc6e8753e63c0242d7dae660f4');
});
