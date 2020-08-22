import {Component, OnInit} from '@angular/core';
import {ArticlesService} from '../articles.service';

@Component({
  selector: 'app-articles-creation',
  templateUrl: './articles-creation.component.html',
  styleUrls: ['./articles-creation.component.less']
})
export class ArticlesCreationComponent implements OnInit {
  public message = '';
  public success = false;
  constructor(private articlesService: ArticlesService) {
  }

  ngOnInit(): void {
  }

  addArticle(text: string): void {
    this.articlesService.addArticle(text).subscribe(responseData => {
      this.success = true;
      this.message = 'Artikel erfolgreich hinzugefügt';
    }, error => {
      this.success = false;
      this.message = error;
    });
  }
}
