import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lessonOneBonusIntro} from '../src/lesson-one-bonus.js';
import {runnerConfig} from '../src/runner-config.js';
const button=(text,action)=>`<button data-action="${action}">${text}</button>`;
test('bonus setup keeps the chosen Zion, explains rewards and offers one start action',()=>{
 const config=runnerConfig(1,'post'),before=structuredClone(config);
 const html=lessonOneBonusIntro(config,'eli','<img class="runner-guide-character" alt="Zion">',button,String);
 assert.match(html,/Ready, Zion/);assert.match(html,/Collect <strong>200<\/strong> bonus points/);
 assert.match(html,/Start Bonus Run/);assert.match(html,/Skip Bonus Run/);assert.match(html,/\$10 bonus dollars/);assert.match(html,/Jump hit: \$5/);
 assert(!html.includes('runner-character'));assert(!html.includes('Choose your runner'));
 assert.equal((html.match(/data-action="runner-start"/g)||[]).length,1);assert.deepEqual(config,before);
});
