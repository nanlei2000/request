import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import axios, { CancelToken } from 'axios';
import { request, ErrorRes } from './axios';
import * as E from 'fp-ts/lib/Either';
export const genRequestObservable = <Params extends object, Res extends object>(url: string) => (data: Params) =>
    getAxiosObservable<Res>(token => {
        return request({
            url,
            data,
            cancelToken: token
        });
    }).pipe(
        map(v => E.right<ErrorRes, Res>(v)),
        catchError((error: ErrorRes) => {
            return of(E.left<ErrorRes, Res>(error));
        })
    );
/** 将`request`封装为一个`observable` */
export function getAxiosObservable<T>(request: (cancelToken: CancelToken) => Promise<T>): Observable<T> {
    return Observable.create((observer: any) => {
        const cancelToken = axios.CancelToken.source();
        request(cancelToken.token).then(
            result => {
                observer.next(result);
                observer.complete();
            },
            err => {
                if (axios.isCancel(err)) {
                    observer.complete();
                } else {
                    observer.error(err);
                }
            }
        );

        return () => cancelToken.cancel();
    });
}