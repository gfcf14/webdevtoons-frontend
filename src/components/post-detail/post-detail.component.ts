import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Post } from '../../models/post/post.model';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {
  post: Post | null = null;
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit(): void {
    const urlParams = this.route.snapshot.paramMap;
    const date = urlParams.get('date');

    if (date) {
      this.postService.getPostByDate(date).subscribe({
        next: (data) => {
          this.post = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load post',
          this.loading = false;
          console.error(err);
        }
      })
    }
  }

  getPlatformIcon(type: string): string {
    return `assets/icons/${type}.webp`;
  }
}
