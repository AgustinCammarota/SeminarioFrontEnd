import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  abrirDashboar(): void {

    const elemento = document.getElementById('sidebarMenu');
    elemento.classList.toggle('d-md-block');

  }

}
