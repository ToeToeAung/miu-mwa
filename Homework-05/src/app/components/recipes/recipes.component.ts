import { Component, signal, computed, effect } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Title } from '@angular/platform-browser';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipes',
  template: `
    <div class="container">
      @if (recipes().length > 0) {
        <div class="recipe-list">
        @for (recipe of recipes(); track recipe.id) {
            <div class="recipe-card">
              <img [src]="recipe.image" alt="{{ recipe.name }}" />
              <h2>{{ recipe.name }}</h2>
              <p><strong>Cuisine:</strong> {{ recipe.cuisine }}</p>
              <p><strong>Prep Time:</strong> {{ recipe.prepTimeMinutes }} mins</p>
              <p><strong>Cook Time:</strong> {{ recipe.cookTimeMinutes }} mins</p>
              <p><strong>Rating:</strong> {{ recipe.rating }} ({{ recipe.reviewCount }} reviews)</p>
            </div>
          }
        </div>
      } @else {
        <p>Loading recipes...</p>
      }
      <div class="pagination">
        <button (click)="prevPage()" [disabled]="currentPage() === 1">Previous</button>
        <button (click)="nextPage()" [disabled]="currentPage() === totalPages()">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .container { text-align: center; margin: 20px; }
    .recipe-list { display: flex; flex-wrap: wrap; justify-content: center; }
    .recipe-card { border: 1px solid #ddd; padding: 10px; margin: 10px; width: 250px; text-align: left; }
    .recipe-card img { max-width: 100%; height: auto; border-radius: 5px; }
    .pagination { margin: 10px; }
    button { margin: 5px; }
  `],
})
export class RecipesComponent {
  recipes = signal<Recipe[]>([]);
  currentPage = signal(1);
  pageSize = 4;
  totalRecipes = 100; 

  constructor(private recipeService: RecipeService, private title: Title) {
    this.loadRecipes();

    effect(() => {
      const totalPages = this.totalPages();
      this.title.setTitle(`Showing page ${this.currentPage()} of ${totalPages}`);
    });
  }

  loadRecipes() {
    const skip = (this.currentPage() - 1) * this.pageSize;
    this.recipeService.getRecipes(this.pageSize, skip).subscribe(
      (response) => {
        console.log('Response ' + response)
    //    this.recipes.set(response.recipes);  // Assuming `recipes` is a Map or a similar collection
      //  this.totalRecipes = response.total;  // Make sure `total` is returned from the API
      },
      (error) => {
        console.error('Error loading recipes:', error);
      }
    );
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.loadRecipes();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.loadRecipes();
    }
  }

  totalPages() {
    return Math.ceil(this.totalRecipes / this.pageSize);
  }
}