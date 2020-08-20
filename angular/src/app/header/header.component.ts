import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  public isAuthenticated = false;
  public username = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.getAuthenticatedUser().subscribe(user => {
      if (user.id == null) {
        this.isAuthenticated = false;
        this.username = '';
      } else {
        this.isAuthenticated = true;
        this.username = user.username;
      }
    });

    this.authService.authenticationChanged.subscribe(() => {
      this.authService.getAuthenticatedUser().subscribe(user => {
        if (user.id == null) {
          this.isAuthenticated = false;
          this.username = '';
        } else {
          this.isAuthenticated = true;
          this.username = user.username;
        }
      });
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
