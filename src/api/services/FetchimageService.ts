/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FetchimageService {

    /**
     * @param n
     * @param l
     * @returns any
     * @throws ApiError
     */
    public static fetchimageRead(
        n?: number,
        l?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/fetchimage/',
            query: {
                'n': n,
                'l': l,
            },
        });
    }

}
