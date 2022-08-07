/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GameRound } from '../models/GameRound';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GameroundService {

    /**
     * @returns GameRound
     * @throws ApiError
     */
    public static gameroundRead(): CancelablePromise<GameRound> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gameround/',
        });
    }

}
