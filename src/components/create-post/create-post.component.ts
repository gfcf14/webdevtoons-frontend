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
  post: Post = {
    date: '',
    description: '',
    image: '',
    links: [],
    title: '',
  };
  loading = false;
  error: string | null = null;

  constructor(private postService: PostService, private router: Router) {}

  addLink() {
    this.post.links.push({type: '', url: ''});
  }

  removeLink(index: number) {
    this.post.links.splice(index, 1);
  }

  submitPost(): void {
    this.postService.createPost(this.post).subscribe((newPost) => {
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
