import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'angular-fe';

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    form.reset();
  }
}
