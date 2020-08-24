import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService} from '../articles.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.less']
})
export class ArticlesListComponent implements OnInit {

  public articles: string[];
  constructor(private articlesService: ArticlesService, private route: ActivatedRoute, public router: Router) {
  }

  ngOnInit(): void {
    this.articlesService.articles = new Array<string>();
    this.articlesService.fetchArticles();

    this.articlesService.articlesChanged.subscribe((articles: string[]) => {
      this.articles = articles;
    });
  }

  showEditor(): void {
    this.router.navigate(['add'], {relativeTo: this.route});
  }
}
