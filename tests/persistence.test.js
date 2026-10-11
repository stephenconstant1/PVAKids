import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,begin,choose,finish} from '../src/engine.js';
import {load,save,clear,storageWarning} from '../src/persistence.js';
function storage(){const data=new Map();Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}});return data;}
test('save/load roundtrip preserves unfinished choices and original replay balances',()=>{storage();let p=begin(newGame('Maya'),1);p.active.step='choice';p=finish(choose(p,'product'));p=begin(p,2);p.active.step='choice';p=choose(p,750);assert.equal(save(p),true);assert.deepEqual(load(),p);assert.equal(clear(),true);assert.equal(load(),null);});
test('malformed saves and incomplete mission state fail with a visible warning',()=>{const data=storage();data.set('money-ops-v02','not json');assert.equal(load(),null);assert.match(storageWarning,/could not be loaded/);const p=begin(newGame(),1);p.active.step='debrief';save(p);assert.equal(load(),null);});
test('unavailable storage reports failure instead of claiming persistence',()=>{Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>{throw Error('blocked')},setItem:()=>{throw Error('full')},removeItem:()=>{throw Error('blocked')}}});assert.equal(save(newGame()),false);assert.match(storageWarning,/may be lost/);assert.equal(clear(),false);assert.match(storageWarning,/could not be cleared/);assert.equal(load(),null);});
