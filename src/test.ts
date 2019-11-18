import { CommentViewApi } from "./api";
import { tap, concatMap } from "rxjs/operators";
import { genRequestObservable, Match } from "./rx";

CommentViewApi.http({}).pipe(
    tap((res) => {
        Match(res)(
            {
                Err: err => console.log("→: err", err),
                Ok: data => console.log(data.data.comment_data)
            }
        );
    }),
    concatMap(() => {
        // 错误测试
        return genRequestObservable<{}, never>('$$$')({}).pipe(
            tap((res) => {
                Match(res)(
                    {
                        Err: err => console.log("→: err", err),
                        Ok: data => console.log(data)
                    }
                );
            })
        );
    })
).subscribe();
