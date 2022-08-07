/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiError } from './core/ApiError';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { CommonLocation } from './models/CommonLocation';
export type { ExtendedGameRound } from './models/ExtendedGameRound';
export type { FullGameRound } from './models/FullGameRound';
export type { GameRound } from './models/GameRound';
export type { GameRoundLocation } from './models/GameRoundLocation';
export type { Guess } from './models/Guess';
export type { GuessCreate } from './models/GuessCreate';

export { FetchimageService } from './services/FetchimageService';
export { GameroundService } from './services/GameroundService';
export { GuessService } from './services/GuessService';
export { ResultsService } from './services/ResultsService';
