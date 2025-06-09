import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../../models/post/post.model';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  // Login state
  isLoggedIn = false;
  username = '';
  password = '';
  loginError: string | null = null;

  // Post creation form
  post: Post = {
    title: '',
    date: '',
    description: '',
    image: '',
    links: [],
  };

  loading = false;
  error: string | null = null;

  previewOpen = false;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const now = Date.now();

      if (now < expiry) {
        this.isLoggedIn = true;
      } else {
        sessionStorage.removeItem('token');
        this.isLoggedIn = false;
      }
    } else {
      this.isLoggedIn = false;
    }
  }

  openPreview() {
    this.previewOpen = true;
  }

  closePreview() {
    this.previewOpen = false;
  }

  login() {
    this.postService.login(this.username, this.password).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.token); // save token for session only
        this.isLoggedIn = true;
        this.loginError = null;
      },
      error: (err) => {
        this.loginError = 'Invalid credentials';
        console.error('Login failed', err);
      }
    });
  }

  logout() {
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  addLink() {
    this.post.links.push({ type: '', url: '' });
  }

  removeLink(index: number) {
    this.post.links.splice(index, 1);
  }

  isFormValid(): boolean {
    const { title, date, image } = this.post;
    const hasRequiredFields = title && date && image;
    const allLinksValid = this.post.links.every(link => link.type && link.url);
    return !!hasRequiredFields && allLinksValid;
  }

  clearForm() {
    this.post = {
      title: '',
      date: '',
      description: '',
      image: '',
      links: [],
    };
    this.error = null;
  }

  submitPost(): void {
    if (!this.isFormValid()) return;

    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    this.loading = true;
    this.postService.createPost(this.post, headers).subscribe({
      next: () => {
        this.loading = false;
        this.clearForm();
      },
      error: (err) => {
        this.error = err.status === 401 ?
          'Unauthorized: Please log in with a user that can post.' :
          'Failed to create post.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}