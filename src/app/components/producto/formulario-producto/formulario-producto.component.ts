import {Component, Inject, OnInit} from '@angular/core';
import {ProductoService} from '../../../services/producto.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Producto} from '../../../models/producto';
import {CategoriaService} from '../../../services/categoria.service';
import {Categoria} from '../../../models/categoria';
import {Router} from '@angular/router';
import Swal from "sweetalert2";

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
  loading = true;
  categoriaSeleccionada: Categoria;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  fotoSeleccionada: File;

  constructor(private productoService: ProductoService,
              private categoriaService: CategoriaService,
              private router: Router,
              private form: FormBuilder,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<FormularioProductoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Producto) {}

  ngOnInit(): void {
    this.crearFormulario();

    this.titulo = Object.keys(this.data).length === 0 ? 'Registrar Producto' : 'Actualizar Producto';

    this.categoriaService.getCategorias().subscribe((categorias: Categoria[]) => {
      this.loading = false;
      this.categorias = categorias;
    }, () => {
      this.router.navigate(['/error']);
    });
  }

  guardar(): void {
    if (this.fotoSeleccionada === null) {
     // Validar cuando no se seleccione ninguna iamgen setear valor de imagen estatica
    }
    this.loading = true;
    this.producto = new Producto(this.formulario.value.nombre.trim(),
      this.formulario.value.precio,
      this.formulario.value.cantidad,
      this.formulario.value.descripcion,
      this.formulario.value.archivo,
      this.formulario.value.categoria,
      true);
    if (Object.keys(this.data).length === 0) {
      this.productoService.saveProducto(this.producto, this.fotoSeleccionada).subscribe(producto => {
        this.loading = false;
        this.snackBar.open(`¡Producto ${producto.nombre} agregado con exito!`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
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
      this.producto.id = this.data.id;
      this.productoService.updateProducto(this.producto, this.fotoSeleccionada).subscribe(producto => {
        this.loading = false;
        this.snackBar.open(`¡Producto ${producto.nombre} actualizado con exito!`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
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

  private crearFormulario(): void {
    this.formulario = this.form.group({
      nombre: [this.data.nombre, [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      precio: [this.data.precio, [Validators.required]],
      cantidad: [this.data.cantidad, [Validators.required]],
      descripcion: [this.data.descripcion, [Validators.required]],
      archivo: [this.data.archivo],
      categoria: [this.data.categoria, [Validators.required]]
    });
  }

  get validarNombre(): boolean {
    return this.formulario.get('nombre').invalid &&
      this.formulario.get('nombre').touched &&
      this.formulario.get('nombre').errors.pattern;
  }
}
