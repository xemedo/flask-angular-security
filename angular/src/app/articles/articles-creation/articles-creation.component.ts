import {Component, OnInit} from '@angular/core';
import {ArticlesService} from '../articles.service';

@Component({
  selector: 'app-articles-creation',
  templateUrl: './articles-creation.component.html',
  styleUrls: ['./articles-creation.component.less']
})
export class ArticlesCreationComponent implements OnInit {

  constructor(private articlesService: ArticlesService) {
  }

  ngOnInit(): void {
  }

  addArticle(): void {
    this.articlesService.addArticle().subscribe(responseData => {

    }, error => {
    });
  }
}
