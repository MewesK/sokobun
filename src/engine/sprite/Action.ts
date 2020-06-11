import Animation from './Animation';
import { DirectionType } from './DirectionType';

export default class Action {
    public readonly directionAnimationList: Record<DirectionType, Animation>;
    public readonly duration: number;

    public constructor(directionAnimationList: Record<DirectionType, Animation>, duration: number) {
        if (Object.keys(directionAnimationList).length === 0) {
            throw new Error('There must be at least one directionType defined.');
        }

        this.directionAnimationList = directionAnimationList;
        this.duration = duration;
    }
}
