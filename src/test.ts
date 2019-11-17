import { CommentViewApi } from "./api";
import { tap } from "rxjs/operators";
import * as E from 'fp-ts/lib/Either';
import { pipe as fp } from 'fp-ts/lib/pipeable';

CommentViewApi.http({}).pipe(
    tap((res) => {
        fp(
            res,
            E.fold(
                err => console.log("→: err", err),
                data => console.log(data.data.comment_data)
            )
        );
    })
).subscribe();