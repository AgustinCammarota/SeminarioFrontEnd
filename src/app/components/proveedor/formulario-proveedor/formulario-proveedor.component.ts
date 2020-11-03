import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProveedorService} from '../../../services/proveedor.service';
import {Proveedor} from '../../../models/proveedor';
import Swal from 'sweetalert2';
import {Producto} from '../../../models/producto';
import {Observable} from 'rxjs';
import {ProductoService} from '../../../services/producto.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {flatMap, map} from 'rxjs/operators';

@Component({
  selector: 'app-formulario-proveedor',
  templateUrl: './formulario-proveedor.component.html',
  styleUrls: ['./formulario-proveedor.component.css']
})
export class FormularioProveedorComponent implements OnInit {

  formulario: FormGroup;
  proveedor: Proveedor | any = {};
  productos: Producto[];
  productoFiltrado: Observable<Producto[]>;
  titulo: string;
  loading = false;
  nombreControl = new FormControl();
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private form: FormBuilder,
              private service: ProveedorService,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<FormularioProveedorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Proveedor,
              private serviceProducto: ProductoService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.titulo = Object.keys(this.data).length === 0 ? 'Registrar Proveedor' : 'Actualizar Proveedor';

    Object.keys(this.data).length === 0 ? this.productos = [] : this.productos = this.data.productos;
  }

  guardar(): void {
    this.loading = true;
    this.proveedor = new Proveedor(this.formulario.value.nombre.trim(),
      this.formulario.value.email.trim(),
      this.formulario.value.direccion,
      this.formulario.value.telefono,
      this.productos);
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

  filtrarProductos(): void {
    this.productoFiltrado = this.nombreControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      flatMap(value => value ? this.filtrar(value) : []),
    );
  }

  limpiarFiltro(): void {
    this.productoFiltrado = new Observable<Producto[]>();
    this.nombreControl.reset();
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto;
    this.productos.length > 0 ? (this.productos.findIndex(p => p.id === producto.id) < 0 ? this.productos.push(producto) :
      Swal.fire(
        {
          icon: 'error',
          title: 'Error al seleccionar el producto',
          text: 'El producto ya se encuentra seleccionado',
        }
      )) : this.productos.push(producto);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  borrarProducto(producto: Producto): void {
    this.productos = this.productos.filter(p => p.id !== producto.id);
  }

  private crearFormulario(): void {
    this.formulario = this.form.group({
      nombre: [this.data.nombre, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: [this.data.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
      direccion: [this.data.direccion],
      telefono: [this.data.telefono, [Validators.required]],
      productos: ['']
    });
  }

  private filtrar(termino: string): Observable<Producto[]> {
    return this.serviceProducto.getProductoFiltro(termino.toLowerCase());
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
}
