/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FullGameRound } from './FullGameRound';

export type Guess = {
    id: number;
    location: string;
    guessNumber: number;
    distance: number;
    game_round?: FullGameRound;
};

