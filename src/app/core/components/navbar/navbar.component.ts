import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
    <header class="py-2 mb-3" role="banner">
        <div class="container">
            <h1 class="display-8">Tourist Trapp</h1>
        </div>  
    </header>
  `
})
export class NavbarComponent {

}
