import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { Post } from '../../models/post/post.model';
import { PostService } from '../../services/post/post.service';
import { LoaderService } from '../../services/loader/loader.service';
import { FlashMessageService } from '../../services/flash-message/flash-message.service';
import { LoginService } from '../../services/login/login.service';

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

  deviceType$: Observable<'mobile' | 'tablet' | 'desktop'>;

  constructor(private postService: PostService, private loginService: LoginService, private router: Router, private loader: LoaderService, private flash: FlashMessageService, private breakpointObserver: BreakpointObserver) {
    this.deviceType$ = this.breakpointObserver
      .observe([
        '(max-width: 767.98px)', // mobile
        '(min-width: 768px) and (max-width: 1023.98px)', // tablet
        '(min-width: 1024px)' // desktop
      ])
      .pipe(
        map(({ breakpoints }) => {
          if (breakpoints['(max-width: 767.98px)']) {
            return 'mobile';
          } else if (breakpoints['(min-width: 768px) and (max-width: 1023.98px)']) {
            return 'tablet';
          } else {
            return 'desktop';
          }
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }

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

  loginOnEnter() {
    if (!!this.username && !!this.password) {
      this.login();
    }
  }

  login() {
    this.loader.show();

    this.loginService.login(this.username, this.password).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.token); // save token for session only
        this.isLoggedIn = true;
        this.loginError = null;
        this.loader.hide();
      },
      error: (err) => {
        this.loginError = 'Invalid credentials';
        this.loader.hide();
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

  isLoginFormValid(): boolean {
    return !!this.username && !!this.password;
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
    this.loader.show();
    this.postService.createPost(this.post, headers).subscribe({
      next: () => {
        this.loading = false;
        this.loader.hide();
        this.clearForm();
        this.flash.show('Post created successfully!', 'success');
      },
      error: (err) => {
        this.loading = false;
        this.loader.hide();
        this.flash.show('Failed to create post', 'error');
        console.error(err);
      }
    });
  }
}