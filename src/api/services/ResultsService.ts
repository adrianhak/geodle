/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExtendedGameRound } from '../models/ExtendedGameRound';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ResultsService {

    /**
     * @param limit Number of results to return per page.
     * @param offset The initial index from which to return the results.
     * @param c
     * @returns any
     * @throws ApiError
     */
    public static resultsList(
        limit?: number,
        offset?: number,
        c?: string,
    ): CancelablePromise<{
        count: number;
        next?: string | null;
        previous?: string | null;
        results: Array<ExtendedGameRound>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/results/',
            query: {
                'limit': limit,
                'offset': offset,
                'c': c,
            },
        });
    }

}
