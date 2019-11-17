import { genRequestObservable } from "./rx";

/**
 */
export namespace CommentViewApi {
    export interface Params {
    }
    export const URL = '/login/comment-view';
    export const http = genRequestObservable<Params, Res.Root>(URL);
    export namespace Res {

        export interface Root {
            msg: string;
            code: number;
            data: Data;
        }

        export interface Data {
            comment_data: string[];
        }

    }
}