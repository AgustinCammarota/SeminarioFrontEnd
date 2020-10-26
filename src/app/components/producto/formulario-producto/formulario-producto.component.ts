import {Component, Inject, OnInit} from '@angular/core';
import {ProductoService} from '../../../services/producto.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Producto} from '../../../models/producto';
import {Categoria} from '../../../models/categoria';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['./formulario-producto.component.css']
})
export class FormularioProductoComponent implements OnInit {

  categorias: Categoria[] = [];
  formulario: FormGroup;
  producto: Producto | any = {};
  titulo: string;
  loading = false;
  categoriaSeleccionada: Categoria;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  fotoSeleccionada: File;

  constructor(private productoService: ProductoService,
              private router: Router,
              private form: FormBuilder,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<FormularioProductoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.categorias = this.data[0];
    this.crearFormulario();
    this.titulo = this.data.length === 1 ? 'Registrar Producto' : 'Actualizar Producto';
  }

  guardar(): void {
    this.loading = true;
    this.producto = new Producto(this.formulario.value.nombre.trim(),
      this.formulario.value.precio,
      this.formulario.value.cantidad,
      this.formulario.value.descripcion,
      this.formulario.value.archivo,
      this.formulario.value.categoria,
      true);
    if (this.data.length === 1) {
      this.productoService.saveProducto(this.producto).subscribe(producto => {
        this.loading = false;
        if (this.fotoSeleccionada) {
          this.guardarProductoFoto(producto);
        } else {
          this.snackBar.open(`¡Producto ${producto.nombre} agregado con exito!`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
          });
        }
        this.dialogRef.close(producto);
      }, error => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: error.error.mensaje,
          text: error.error.error,
        });
      });
    } else {
      this.producto.id = this.data[1].id;
      this.producto.fechaCreate = this.data[1].fechaCreate;
      this.productoService.updateProducto(this.producto).subscribe(producto => {
        this.loading = false;
        if (this.fotoSeleccionada) {
          this.guardarProductoFoto(producto);
        } else {
          this.snackBar.open(`¡Producto ${producto.nombre} actualizado con exito!`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
          });
        }
        this.dialogRef.close(producto);
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

  seleccionarFoto(event): void {
    this.fotoSeleccionada = event.target.files[0];
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error al seleccionar la foto',
        text: 'El archivo deber ser del tipo imagen',
      });
      this.fotoSeleccionada = null;
      this.formulario.get('archivo').reset();
    }
  }

  private guardarProductoFoto(producto: Producto): void {
    this.loading = true;
    this.productoService.saveProductoFoto(producto.id.toString(), this.fotoSeleccionada).subscribe(p => {
      this.loading = false;
      this.snackBar.open(`¡Producto ${p.nombre} agregado con exito!`, 'Cerrar', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });
    }, error => {
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: error.error.mensaje,
        text: error.error.error,
      });
    });
  }

  private crearFormulario(): void {
    this.formulario = this.form.group({
      nombre: [this.data.length === 2 ? this.data[1].nombre : '', [Validators.required, Validators.pattern('^[a-zA-Z-0-9 ]+$')]],
      precio: [this.data.length === 2 ? this.data[1].precio : '', [Validators.required]],
      cantidad: [this.data.length === 2 ? this.data[1].cantidad : '', [Validators.required]],
      descripcion: [this.data.length === 2 ? this.data[1].descripcion : '', [Validators.required]],
      archivo: [this.data.length === 2 ? this.data[1].archivo : ''],
      categoria: [this.data.length === 2 ? this.data[1].categoria : '', [Validators.required]]
    });
  }

  get validarNombre(): boolean {
    return this.formulario.get('nombre').invalid &&
      this.formulario.get('nombre').touched &&
      this.formulario.get('nombre').errors.pattern;
  }
}
