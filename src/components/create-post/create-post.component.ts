import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  constructor(private postService: PostService) {}

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

    this.loading = true;
    this.postService.createPost(this.post).subscribe({
      next: () => {
        this.loading = false;
        this.clearForm();
      },
      error: (err) => {
        this.error = 'Failed to create post.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}