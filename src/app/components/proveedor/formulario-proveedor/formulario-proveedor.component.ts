import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProveedorService} from '../../../services/proveedor.service';
import {Proveedor} from '../../../models/proveedor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-proveedor',
  templateUrl: './formulario-proveedor.component.html',
  styleUrls: ['./formulario-proveedor.component.css']
})
export class FormularioProveedorComponent implements OnInit {

  formulario: FormGroup;
  proveedor: Proveedor | any = {};
  titulo: string;
  loading = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private form: FormBuilder,
              private service: ProveedorService,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<FormularioProveedorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Proveedor) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.titulo = Object.keys(this.data).length === 0 ? 'Registrar Proveedor' : 'Actualizar Proveedor';
  }

  guardar(): void {
    this.loading = true;
    this.proveedor = new Proveedor(this.formulario.value.nombre.trim(),
      this.formulario.value.email.trim(),
      this.formulario.value.direccion,
      this.formulario.value.telefono,
      null);
    if (Object.keys(this.data).length === 0) {
      this.service.saveProveedor(this.proveedor).subscribe(proveedor => {
        this.loading = false;
        this.snackBar.open(`¡Proveedor ${proveedor.nombre} agregado con exito!`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
        this.dialogRef.close(proveedor);
      }, error => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: error.error.mensaje,
          text: error.error.error,
        });
      });
    } else {
      this.proveedor.id = this.data.id;
      this.service.updateProveedor(this.proveedor).subscribe(proveedor => {
        this.loading = false;
        this.snackBar.open(`¡Proveedor ${proveedor.nombre} actualizado con exito!`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
        this.dialogRef.close(proveedor);
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
      direccion: [this.data.direccion, [Validators.pattern('^[a-zA-Z-0-9 ]+$')]],
      telefono: [this.data.telefono, [Validators.required]],
      productos: [this.data.productos]
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

  get direccionNovalido(): boolean {
    return this.formulario.get('direccion').invalid &&
      this.formulario.get('direccion').touched &&
      !this.formulario.get('direccion').errors.required;
  }
}
