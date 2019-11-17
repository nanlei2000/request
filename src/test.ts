import { CommentViewApi } from "./api";
import { tap, concatMap } from "rxjs/operators";
import * as E from 'fp-ts/lib/Either';
import { pipe as fp } from 'fp-ts/lib/pipeable';
import { genRequestObservable } from "./rx";

CommentViewApi.http({}).pipe(
    tap((res) => {
        fp(
            res,
            E.fold(
                err => console.log("→: err", err),
                data => console.log(data.data.comment_data)
            )
        );
    }),
    concatMap(() => {
        // 错误测试
        return genRequestObservable<{}, never>('$$$')({}).pipe(
            tap((res) => {
                fp(
                    res,
                    E.fold(
                        err => console.log("→: err", err),
                        data => console.log(data)
                    )
                );
            })
        );
    })
).subscribe();
