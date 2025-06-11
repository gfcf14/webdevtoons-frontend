import { Routes } from '@angular/router';
import { PostListComponent } from '../components/post-list/post-list.component';
import { CreatePostComponent } from '../components/create-post/create-post.component';
import { PostDetailComponent } from '../components/post-detail/post-detail.component';
import { AboutComponent } from '../components/about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: PostListComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'create',
    component: CreatePostComponent
  },
  {
    path: ':date',
    component: PostDetailComponent
  },
];
