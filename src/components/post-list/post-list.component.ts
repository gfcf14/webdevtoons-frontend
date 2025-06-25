import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post/post.model';
import { PostService } from '../../services/post/post.service';
import { RouterModule } from '@angular/router';
import { LoaderService } from '../../services/loader/loader.service';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, ErrorComponent, RouterModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  loading: boolean = false;
  error: boolean = false;

  constructor(private postService: PostService, private loader: LoaderService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {
    this.error = false;
    this.loading = true;
    this.loader.show();

    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.loading = false;
        this.posts = data;
        this.loader.hide();
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.loader.hide();
        console.error(err);
      }
    });
  }

  getLink(date: string): string {
    return `/${date}`;
  }
}
