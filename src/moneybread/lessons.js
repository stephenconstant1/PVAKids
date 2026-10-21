import data from './lessons.json' with { type: 'json' };
// Editable source snapshot. Titles, wording, sequence, examples and vocabulary are
// copied from the original repository. City districts are gameplay metadata only.
export const lessons = data;
export const missingLessons = Array.from({ length: 32 }, (_, i) => i + 1).filter(id => {
    const l = lessons.find(l => l.id === id);
    return !l?.title || !l.coreIdea || !l.terms?.length;
});
export function lesson(id) {
    const l = lessons.find(l => l.id === id);
    if (!l || missingLessons.includes(id))
        throw Error(`Level ${id}: source lesson needed`);
    return l;
}
