import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe',
  //standalone: true,
  imports: [MatCardModule,CommonModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ recipe.name | slice: 0: 20 }}...</mat-card-title>
      </mat-card-header>
      <img mat-card-image [src]="recipe.image" alt="Recipe image" />
      <mat-card-content>
        <p><strong>Prep Time:</strong> {{ recipe.prepTimeMinutes }} mins</p>
        <p><strong>Cook Time:</strong> {{ recipe.cookTimeMinutes }} mins</p>
        <p><strong>Servings:</strong> {{ recipe.servings }}</p>
        <p><strong>Difficulty:</strong> {{ recipe.difficulty }}</p>
        <p><strong>Ingredients:</strong> {{ recipe.ingredients.join(', ') }}</p>
      </mat-card-content>
    </mat-card>
  `,
})

export class RecipeComponent {
  @Input() recipe: any;
}