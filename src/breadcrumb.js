/** Location only: existing navigation remains responsible for changing activities. */
export function sectionTrail(profile,ui={}){
 if(ui.home||!profile)return ['Home'];
 if(ui.comic)return ['Home',`Lesson ${ui.comicLessonId||profile.active?.id||1}`,ui.opening?'Opening':'Comic'];
 if(ui.job)return ['Home','Lesson 1',ui.checked?'Money plan':'Run the Job'];
 if(profile.screen==='job-complete')return ['Home','Lesson 1','Complete'];
 if(profile.screen==='runner'&&profile.runnerSession){const r=profile.runnerSession;return ['Home',profile.mode==='arcade'?'Arcade':`Lesson ${r.lessonId}`,r.status==='results'?'Run results':r.status==='playing'?'Running game':'Run setup'];}
 if(profile.mode==='arcade')return ['Home','Arcade'];
 if(profile.screen==='mission'&&profile.active)return ['Home',`Lesson ${profile.active.id}`,'Activity'];
 const tabs={honors:'Achievements',ledger:'Portfolio',teacher:'Teacher view',profile:'Profile',map:'City map'};
 if(tabs[ui.tab])return ['Home','Career',tabs[ui.tab]];
 const views={school:'Lessons',work:'Work',wallet:'Wallet',progress:'Lesson progress'};
 return ['Home','Career',views[ui.cityView]||'Overview'];
}
export function breadcrumbMarkup(trail,escape){return `<nav class="section-breadcrumb" aria-label="Breadcrumb"><ol>${trail.map((label,index)=>`<li${index===trail.length-1?' aria-current="page"':''}>${escape(label)}</li>`).join('')}</ol></nav>`;}
export function installBreadcrumb(app,profile,ui,escape){
 const comic=app.querySelector('[data-motion-comic]'),job=app.querySelector('[data-job-board]');
 const trail=sectionTrail(profile,{...ui,comic:!!comic,comicLessonId:comic?.dataset.comicRoute==='job'?1:undefined,opening:comic?.dataset.comicOpening==='true',job:!!job,checked:!!job?.querySelector('.job-leftover')});
 const markup=breadcrumbMarkup(trail,escape);
 if(comic){comic.querySelector('.motion-heading small')?.insertAdjacentHTML('afterend',markup);comic.querySelector('.motion-heading small')?.classList.add('sr');return;}
 if(job){job.insertAdjacentHTML('beforeend',markup);return;}
 const career=app.querySelector('.career-simple-nav>span');if(career){career.outerHTML=markup;return;}
 const brandLabel=app.querySelector('#app>header .brand>span:last-child>small');if(brandLabel){brandLabel.outerHTML=markup;return;}
 const target=app.querySelector('.home-image-stage,.job-completion>section')||app.querySelector('#main');
 target?.insertAdjacentHTML('afterbegin',markup);
}
