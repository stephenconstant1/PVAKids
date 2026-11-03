/** High-resolution standalone redraws guided by the supplied original comic. */
const panels = [
    { text: 'A customer needs help!', description: 'The crew meets a neighbor beside a garden that needs help.' },
    { text: 'What problem can we solve?', description: 'The crew notices weeds and empty flower beds.' },
    { text: 'Yard care creates value!', description: 'Our plan: clear weeds, plant flowers, make it beautiful, help our neighbor, and create a cleaner, brighter city.' },
    { text: 'Materials: seeds and gloves.', description: 'The crew gathers flower seeds, vegetable seeds, gloves, and soil.' },
    { text: 'Labor is our time and effort.', description: 'The crew clears weeds, plants flowers, and waters the garden.' },
    { text: 'Overhead: tools and transport.', description: 'The crew plans shared tools and transportation for the work.' },
    { text: 'Practice example: $100 − $80 = $20 left.', description: 'Payment $100. Materials $25, labor $40, overhead $15. Total cost $80. $20 left.' },
    { text: 'Your turn! Choose a job!', description: 'The crew and their customer celebrate a brighter neighborhood together.' }
];
export function renderJobComic(step, e) {
    const index = Math.max(0, Math.min(7, step)), panel = panels[index];
    return `<section class="job-art-comic" aria-labelledby="job-comic-title"><header><div><small>RUN THE JOB · LESSON 1</small><h1 id="job-comic-title">Create value for a customer</h1></div><span role="status">Panel ${index + 1} of 8</span></header><figure class="job-art-panel" data-job-comic-panel tabindex="-1" aria-label="Panel ${index + 1} of 8"><img class="job-comic-hd" src="assets/crew/job-comic/panel-${index + 1}.png" width="1448" height="1086" alt="${e(panel.text)} ${e(panel.description)}" decoding="async" fetchpriority="high"/></figure><nav aria-label="Comic panels"><button class="mb-button" data-action="job-comic-back" ${index === 0 ? 'disabled' : ''}>← Back</button><button class="mb-button primary" data-action="job-comic-next">${index === 7 ? 'Choose a job →' : 'Next →'}</button><button class="mb-button" data-action="job-comic-skip">Skip to the job</button></nav><details class="job-comic-transcript"><summary>Read panel text</summary><p>${e(panel.text)}</p><p>${e(panel.description)}</p>${index === 6 ? '<p>Money remaining is what is left after these listed costs, not guaranteed profit.</p>' : ''}</details></section>`;
}
