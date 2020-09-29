import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cliente} from '../../../models/cliente';
import {ClienteService} from "../../../services/cliente.service";

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  formulario: FormGroup;
  cliente: Cliente | any = {};

  constructor(private form: FormBuilder,
              private service: ClienteService) {
    this.crearFormulario();
  }

  ngOnInit(): void {}

  guardar(): void {
    console.log(this.formulario);
    this.cliente = this.formulario.value;
    this.service.saveCliente(this.cliente).subscribe(cliente => {
      console.log(cliente);
      }, () => {

      });
  }

  private crearFormulario(): void {
    this.formulario = this.form.group({
      nombre: ['', [Validators.maxLength(100), Validators.required]],
      email: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      telefono: ['']
    });
  }
}
