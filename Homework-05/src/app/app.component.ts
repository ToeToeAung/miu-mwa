import { Component } from '@angular/core';
import { RecipesComponent } from './components/recipes/recipes.component';

@Component({
  selector: 'app-root',
  imports: [RecipesComponent],  // No need to declare it in AppModule
  template: `<app-recipes></app-recipes>`
})
export class AppComponent {}