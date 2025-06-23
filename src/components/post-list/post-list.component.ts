import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post/post.model';
import { PostService } from '../../services/post/post.service';
import { RouterModule } from '@angular/router';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  error: string | null = null;

  constructor(private postService: PostService, private loader: LoaderService) {}

  ngOnInit(): void {
    this.loader.show();

    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loader.hide();
      },
      error: (err) => {
        this.error = 'Failed to fetch posts';
        this.loader.hide();
        console.error(err);
      }
    });
  }

  getLink(date: string): string {
    return `/${date}`;
  }
}
