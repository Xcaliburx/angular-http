import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    error = new Subject<string>()

    constructor(private http: HttpClient) {}

    createAndStorePost(title, content) {
        const postData: Post = {title: title, content: content}
        this.http
        .post<{ name: string }>(
            'https://ng-domplete-guide-default-rtdb.firebaseio.com/posts.json', 
            postData,
            {
                observe: 'response'
            }
        ).subscribe(responseData => {
            console.log(responseData.body)
        }, error => {
            this.error.next(error.message)
        })
    }

    fetchPost() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty')
        searchParams = searchParams.append('custom', 'key')
        return this.http
        .get<{ [key: string]: Post }>(
            "https://ng-domplete-guide-default-rtdb.firebaseio.com/posts.json",
            {
                headers: new HttpHeaders({ "Custom-Header": "Hello" }),
                params: searchParams,
                responseType: 'json'
            }
        ).pipe(
            map(responseData => {
              const postArray: Post[] = []
              for(const key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                  postArray.push({ ...responseData[key], id:key })
                }
              }
              return postArray;
            }),
            catchError(errorMes => {
                //send to analytic server
                return throwError(errorMes)
            })
        )
    }

    deletePost() {
        return this.http
        .delete(
            "https://ng-domplete-guide-default-rtdb.firebaseio.com/posts.json",
            {
                observe: 'events',
                responseType: 'text'
            }
        ).pipe(
            tap(event => {
                console.log(event)
                if (event.type === HttpEventType.Sent) {
                    // ...
                }
                if (event.type === HttpEventType.Response) {
                    console.log(event.body)
                }
            })
        );
    }
}