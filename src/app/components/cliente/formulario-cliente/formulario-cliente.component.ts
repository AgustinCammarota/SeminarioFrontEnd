import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cliente} from '../../../models/cliente';
import {ClienteService} from '../../../services/cliente.service';
import Swal from 'sweetalert2';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario-cliente.component.html',
  styleUrls: ['./formulario-cliente.component.css']
})
export class FormularioClienteComponent implements OnInit {

  formulario: FormGroup;
  cliente: Cliente | any = {};
  titulo: string;
  loading = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private form: FormBuilder,
              private service: ClienteService,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<FormularioClienteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Cliente) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.titulo = Object.keys(this.data).length === 0 ? 'Registrar Cliente' : 'Actualizar Cliente';
  }

  guardar(): void {
    this.loading = true;
    this.cliente = new Cliente(this.formulario.value.nombre.trim(),
                                this.formulario.value.email.trim(),
                                this.formulario.value.dni,
                                this.formulario.value.telefono);
    if (Object.keys(this.data).length === 0) {
      this.service.saveCliente(this.cliente).subscribe(cliente => {
        this.loading = false;
        this.snackBar.open(`¡Cliente ${cliente.nombre} agregado con exito!`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
        this.dialogRef.close(cliente);
      }, error => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: error.error.mensaje,
          text: error.error.error,
        });
      });
    } else {
      this.cliente.id = this.data.id;
      this.cliente.fechaCreate = this.data.fechaCreate;
      this.service.updateCliente(this.cliente).subscribe(cliente => {
        this.loading = false;
        this.snackBar.open(`¡Cliente ${cliente.nombre} actualizado con exito!`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
        this.dialogRef.close(cliente);
      }, error => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: error.error.mensaje,
          text: error.error.error,
        });
      });
    }
  }

  private crearFormulario(): void {
    this.formulario = this.form.group({
      nombre: [this.data.nombre, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: [this.data.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
      dni: [this.data.dni, [Validators.required]],
      telefono: [this.data.telefono]
    });
  }

  get nombreNovalido(): boolean {
    return this.formulario.get('nombre').invalid &&
      this.formulario.get('nombre').touched &&
      this.formulario.get('nombre').errors.pattern;
  }

  get emailNovalido(): boolean {
    return this.formulario.get('email').invalid &&
      this.formulario.get('email').touched &&
      !this.formulario.get('email').errors.required;
  }

  get dniNovalido(): boolean {
    return this.formulario.get('dni').invalid &&
      this.formulario.get('dni').touched &&
      !this.formulario.get('dni').errors.required;
  }

  get telefonoNovalido(): boolean {
    return this.formulario.get('telefono').invalid &&
      this.formulario.get('telefono').touched &&
      !this.formulario.get('telefono').errors.required;
  }
}
