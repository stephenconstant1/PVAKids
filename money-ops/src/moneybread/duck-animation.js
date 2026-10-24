export const duckVariations = ['kneeling tuck', 'compact squat', 'forward slide', 'reverse slide', 'low lunge', 'side crouch'];
/** No repeat on consecutive triggers; held keys and pointer repeats never reroll. */
export function createDuck(previous = -1, random = Math.random) {
    const roll = Math.max(0, Math.min(.999999, random()));
    const variant = previous < 0 ? Math.floor(roll * 6) : (previous + 1 + Math.floor(roll * 5)) % 6;
    return { variant, elapsedMs: 0, onsetMs: 65 + variant * 5, releasing: false, recoveryMs: 0, recoveryDurationMs: 110 + variant * 6 };
}
export function duckFrame(motion, reduced = false) {
    const phase = motion.releasing ? 2 : !reduced && motion.elapsedMs < motion.onsetMs ? 0 : 1;
    return phase * 6 + motion.variant;
}
