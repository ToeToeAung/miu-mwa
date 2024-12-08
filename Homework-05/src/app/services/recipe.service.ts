import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'https://dummyjson.com/recipes'; 

  constructor(private http: HttpClient) {} 

  getRecipes(pageSize: number, skip: number): Observable<any[]> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('skip', skip.toString());
  
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
