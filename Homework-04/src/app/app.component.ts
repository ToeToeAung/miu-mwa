import { Component } from '@angular/core';
import { RecipesComponent } from './recipes/recipes.component';

@Component({
  selector: 'app-root',
  //standalone: true,
  imports: [RecipesComponent],
  template: `<app-recipes></app-recipes>`
})
export class AppComponent {}
