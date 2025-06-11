import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  socialLinks = [
    {
      type: 'deviantart',
      url: 'https://www.deviantart.com/gfcf14/gallery',
    },
    {
      type: 'facebook',
      url: 'https://www.facebook.com/webdevtoons/',
    },
    {
      type: 'instagram',
      url: 'https://www.instagram.com/webdevtoons/',
    },
  ];

  getPlatformIcon(type: string): string {
    return `assets/icons/${type}.webp`;
  }
}
