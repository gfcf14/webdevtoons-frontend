import { Routes } from '@angular/router';
import { PostListComponent } from '../components/post-list/post-list.component';
import { CreatePostComponent } from '../components/create-post/create-post.component';
import { PostDetailComponent } from '../components/post-detail/post-detail.component';
import { AboutComponent } from '../components/about/about.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { UrlSegment, UrlSegmentGroup, Route } from '@angular/router';

/**
 * Custom UrlMatcher to validate a date format and ensure it's not in the future.
 * Matches YYYY-MM-DD or MM-DD-YYYY.
 * Adjust regex and date parsing based on your exact date format.
 */
export function dateMatcher(segments: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route) {
  if (segments.length === 1) {
    const datePath = segments[0].path;

    // Regex for YYYY-MM-DD or MM-DD-YYYY (e.g. 2025-06-17 or 06-17-2025)

    // Adjust this regex if your date format is different (e.g., uses slashes)
    const dateRegex = /^(\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/;

    if (dateRegex.test(datePath)) {
      let year: number, month: number, day: number;

      // Parse the date based on your expected format
      if (datePath.includes('-')) { // Assuming YYYY-MM-DD or MM-DD-YYYY
        const parts = datePath.split('-');

        if (parts[0].length === 4) { // YYYY-MM-DD
          year = parseInt(parts[0], 10);
          month = parseInt(parts[1], 10);
          day = parseInt(parts[2], 10);
        } else { // MM-DD-YYYY
          month = parseInt(parts[0], 10);
          day = parseInt(parts[1], 10);
          year = parseInt(parts[2], 10);
        }
      } else {
        // Handle other formats if necessary, e.g., if you had 20250617
        return null; // No match if format is not as expected
      }

      // Basic date validity check (e.g., February 30th is invalid)
      const parsedDate = new Date(year, month - 1, day); // Month is 0-indexed

      if (isNaN(parsedDate.getTime()) ||
          parsedDate.getFullYear() !== year ||
          parsedDate.getMonth() !== month - 1 ||
          parsedDate.getDate() !== day) {
        return null; // Invalid date (e.g., 2025-02-30)
      }

      // Check if the date is not in the future
      const today = new Date();
      // For comparison, normalize today to midnight to avoid issues with time
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // If the parsed date is greater than today's date at midnight, it's in the future
      if (parsedDate.getTime() > todayMidnight.getTime()) {
        return null; // Date is in the future
      }

      // If all checks pass, it's a valid date, consume the segment
      return {
        consumed: segments,
        posParams: {
          date: new UrlSegment(datePath, {}) // Make the date available as 'date' parameter
        }
      };
    }
  }

  return null; // No match
}

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
    matcher: dateMatcher,
    component: PostDetailComponent
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
