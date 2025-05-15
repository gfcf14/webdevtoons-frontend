import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../../models/post/post.model';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  post: Post = {title: '', content: '', date: ''};
  loading = false;
  error: string | null = null;

  constructor(private postService: PostService, private router: Router) {}

  submitPost(): void {
    this.postService.createPost(this.post).subscribe((newPost) => {
      if (!this.post.title || !this.post.date || !this.post.content) {
        this.error = 'All fields are required.';
        return;
      }

      this.loading = true;
      this.postService.createPost(this.post).subscribe({
        next: () => {
          this.loading = false;
          console.log(`Post created: ${newPost}`);

          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = 'Failed to create post.';
          this.loading = false;
          console.error(err);
        }
      });
    });
  }
}
