import {test} from 'node:test';
import assert from 'node:assert/strict';
import {castIds,crewHeroMarkup} from '../src/characters.js';

test('home crew hero leads with all six named students in the established order',()=>{
 const markup=crewHeroMarkup();
 assert.match(markup,/home-crew-hero/);
 assert.equal((markup.match(/class="cast-member /g)||[]).length,6);
 assert.deepEqual(castIds,['jordan','maya','kai','sofia','eli','ruby']);
 for(const name of ['Kanyon','Maya','Everest','Sofia','Zion','Ruby'])assert.match(markup,new RegExp(`>${name}<`));
 assert.match(markup,/FINANCIAL FREEDOM: MONEY OPS/);
});
