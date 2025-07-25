import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Post } from '../../models/post/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ErrorComponent } from '../error/error.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, ErrorComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {
  post: Post | null = null;
  loading = true;
  error: string | null = null;

  constructor(private titleService: Title, private route: ActivatedRoute, private postService: PostService, private loader: LoaderService, private router: Router) {}

  ngOnInit(): void {
    this.titleService.setTitle("WebDevToons: Loading Post");
    this.fetchPost();
  }

  fetchPost() {
    this.error = '';
    const urlParams = this.route.snapshot.paramMap;
    const date = urlParams.get('date');

    this.loader.show();

    if (date) {
      this.postService.getPostByDate(date).subscribe({
        next: (data) => {
          if (data.date !== date) {
            // must redirect to matched post date
            this.router.navigate(['/', data.date], { replaceUrl: true });
          }

          this.post = data;
          this.loading = false;
          this.loader.hide();
          this.titleService.setTitle(`WebDevToons: ${data.title} (${data.date})`);
        },
        error: (err) => {
          this.error = 'Failed to load post',
          this.loading = false;
          this.loader.hide();
          console.error(err);
        }
      })
    }
  }

  getPlatformIcon(type: string): string {
    return `assets/icons/${type}.webp`;
  }
}
