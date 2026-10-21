import data from './destinations.json' with { type: 'json' };
// Stop names and lesson numbers come from src/city.js. Coordinates only place
// those existing stops on the illustrated map; they are not new curriculum.
export const destinations = data;
export const missingDestinations = Array.from({ length: 32 }, (_, i) => i + 1).filter(id => {
    const d = destinations.find(d => d.lessonId === id);
    return !d?.name || !d.sourceLocation || d.name === 'source lesson needed' || d.sourceLocation === 'source lesson needed' || !Number.isFinite(d.x) || !Number.isFinite(d.y) || d.x < 0 || d.x > 100 || d.y < 0 || d.y > 100;
});
export function destination(id) {
    return missingDestinations.includes(id) ? undefined : destinations.find(d => d.lessonId === id);
}
