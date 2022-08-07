/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CommonLocation } from './CommonLocation';
import type { GameRoundLocation } from './GameRoundLocation';

export type ExtendedGameRound = {
    id: number;
    date: string;
    readonly answer?: string;
    readonly locations?: Array<GameRoundLocation>;
    play_count: number;
    distribution: Array<number>;
    avg_distance: number;
    most_common_location?: CommonLocation;
};

