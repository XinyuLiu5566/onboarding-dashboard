import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd,
  Event as NavigationEvent,
} from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {}
//   constructor(private router: Router, private authService: AuthService) {
//     this.router.events
//       .pipe(
//         filter(
//           (event: NavigationEvent): event is NavigationEnd =>
//             event instanceof NavigationEnd
//         )
//       )
//       .subscribe((event: NavigationEnd) => {
//         localStorage.setItem('lastUrl', event.urlAfterRedirects);
//       });
//   }

//   ngOnInit(): void {
//     if (this.authService.isAuthenticated()) {
//       const userRole = localStorage.getItem('userRole');
//       const lastUrl = localStorage.getItem('lastUrl');
//       if (userRole === 'employee') {
//         // this.navigateTo(lastUrl || '/employee/personal-info');
//       } else if (userRole === 'hr') {
//         this.navigateTo(lastUrl || '/hr/employee-profiles');
//       } else {
//         this.navigateTo('/login');
//       }
//     }
//   }

//   private navigateTo(url: string) {
//     this.router.navigateByUrl(url);
//   }
}
