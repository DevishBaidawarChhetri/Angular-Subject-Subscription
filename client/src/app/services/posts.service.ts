import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';

// Similar to event emitter
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject();

  constructor(private http: HttpClient) { }

  private baseUrl: string = "http://localhost:3000";

  // Listener for new post
  getPostUpdateListner() {
    return this.postsUpdated.asObservable();
  }

  // Add Post
  addPost(post: Post) {
    this.http.post<{ message: string, postId: string }>(this.baseUrl + '/api/posts', post)
      .subscribe((response) => {
        const id = response.postId;
        post._id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  // Get Posts
  getPost() {
    this.http.get<{ message: string, posts: Post[] }>(this.baseUrl + "/api/posts")
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // Delete Post
  deletePost(postId: string) {
    this.http.delete(this.baseUrl + '/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post._id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }
}
