/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Guess } from '../models/Guess';
import type { GuessCreate } from '../models/GuessCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GuessService {

    /**
     * @param data
     * @returns Guess
     * @throws ApiError
     */
    public static guessCreate(
        data: GuessCreate,
    ): CancelablePromise<Guess> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/guess/',
            body: data,
        });
    }

}
