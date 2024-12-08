import { Component, signal, computed } from '@angular/core';
import { data } from '../data'; 
import { RecipeComponent } from '../recipe/recipe.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-recipes',
 // standalone: true,
  imports: [RecipeComponent, MatPaginatorModule],
  template: `
    <div class="container">
      <app-recipe [recipe]="currentRecipe()"></app-recipe>
      <mat-paginator
        [length]="recipes().length"
        [pageSize]="1"
        [showFirstLastButtons]="true"
        (page)="onPageChange($event.pageIndex)">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px;
    }
  `]
})
export class RecipesComponent {
  recipes = signal(data.recipes);
  currentIndex = signal(0);
  currentRecipe = computed(() => this.recipes()[this.currentIndex()]);
  onPageChange(index: number) {
    this.currentIndex.set(index);
  }
}
