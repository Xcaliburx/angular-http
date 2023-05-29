import { PostsService } from './posts.service';
import { Post } from './post.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false
  error = null
  private errorSub: Subscription

  constructor(private http: HttpClient, private postService: PostsService) {}

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage
    })

    this.fetchPost()
  }

  onCreatePost(postData: Post) {
    // Send Http request
    console.log(postData);
    this.postService.createAndStorePost(postData.title, postData.content)
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPost()
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePost().subscribe(() => {
      this.loadedPosts = []
    })
  }

  private fetchPost() {
    this.isFetching = true
    this.postService.fetchPost()
      .subscribe(posts => {
        this.isFetching = false
        this.loadedPosts = posts
      }, error => {
        this.isFetching = false
        console.log(error)
        this.error = error.message
      })
  }

  onHandleError() {
    this.error = null
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe()
  }
}
