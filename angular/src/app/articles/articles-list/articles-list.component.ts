import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.less']
})
export class ArticlesListComponent implements OnInit {

  constructor(private route: ActivatedRoute, public router: Router) {
  }

  ngOnInit(): void {
  }

  showEditor(): void {
    this.router.navigate(['add'], {relativeTo: this.route});
  }
}
