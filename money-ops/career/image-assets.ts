/** Shared filenames for assets selected by stable internal game IDs. */
export const castImages:Record<string,string>={
  "jordan": "CMI_kanyon-character-green.png",
  "kai": "CMI_everest-character-blue-yellow.png",
  "eli": "CMI_zion-character-red-glasses.png",
  "maya": "CMI_maya-character-purple-yellow-headband.png",
  "sofia": "CMI_sofia-character-pink.png",
  "ruby": "CMI_ruby-character-purple-auburn-hair.png"
};
export function castImage(id:string):string{return `assets/cast/${castImages[id]||castImages.maya}`;}
export const runnerImages:Record<string,string>={
  "jordan": "CMI_kanyon-running-right.png",
  "kai": "CMI_everest-running-right.png",
  "eli": "CMI_zion-running-right.png",
  "maya": "CMI_maya-running-right.png",
  "sofia": "CMI_sofia-running-right.png",
  "ruby": "CMI_ruby-running-right.png"
};
export function runnerImage(id:string):string{return `assets/runner/${runnerImages[id]||runnerImages.maya}`;}
export const comicImages=[
  "CMI_job-comic-01-customer-needs-help.png",
  "CMI_job-comic-02-find-a-problem.png",
  "CMI_job-comic-03-yard-care-creates-value.png",
  "CMI_job-comic-04-materials-seeds-and-gloves.png",
  "CMI_job-comic-05-labor-time-and-effort.png",
  "CMI_job-comic-06-overhead-tools-and-transport.png",
  "CMI_job-comic-07-practice-budget-100-dollars.png",
  "CMI_job-comic-08-choose-a-job.png"
];
export function comicImage(index:number):string{return `assets/crew/job-comic/${comicImages[Math.max(0,Math.min(7,index))]}`;}
export const jobSceneImages:Record<string,string>={
  "service": "CMI_neighborhood-helper-job-scenes.png",
  "tutor": "CMI_school-tutor-job-scenes.png",
  "creator": "CMI_studio-creator-job-scenes.png"
};
export function jobSceneImage(job:string):string{return `assets/crew/production/${jobSceneImages[job]||jobSceneImages.service}`;}
