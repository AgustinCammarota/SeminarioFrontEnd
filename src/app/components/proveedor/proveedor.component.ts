import { Component, OnInit } from '@angular/core';
import {PageProveedor, Proveedor} from '../../models/proveedor';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {flatMap, map} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import {ProveedorService} from '../../services/proveedor.service';
import {FormularioProveedorComponent} from './formulario-proveedor/formulario-proveedor.component';
import {DetalleProveedorComponent} from './detalle-proveedor/detalle-proveedor.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

  proveedores: Proveedor[] | any = [];
  pageSizeOptions: number[] = [3, 5, 10, 20, 50];
  totalElements = 0;
  nombreControl = new FormControl();
  page = 0;
  size = 4;
  proveedorFiltrado: Observable<Proveedor[]>;
  displayedColumns: string[] = ['No.', 'Nombre', 'Correo', 'Direccion', 'Telefono', 'Fecha', 'Acciones'];
  dataSource: MatTableDataSource<Proveedor[]>;
  loading = true;

  constructor(private proveedorService: ProveedorService,
              private router: Router,
              public dialog: MatDialog,
              private paginator: MatPaginatorIntl) { }

  ngOnInit(): void {
    this.paginator.itemsPerPageLabel = 'Registros por página';
    this.calcularRangos();
  }

  filtrarProveedor(): void {
    this.proveedorFiltrado = this.nombreControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      flatMap(value => value ? this.filtrar(value) : []),
    );
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.calcularRangos();
  }

  calcularRangos(): void {
    this.proveedorService.getProveedoresPage(this.page.toString(), this.size.toString()).subscribe((proveedor: PageProveedor) => {
      this.loading = false;
      this.proveedores = proveedor.content;
      this.totalElements = proveedor.totalElements as number;
      this.dataSource = new MatTableDataSource<Proveedor[]>(this.proveedores);
    }, () => {
      this.router.navigate(['/error']);
    });
  }

  mostrarNombre(proveedor?: Proveedor): string | undefined {
    return proveedor ? proveedor.nombre : undefined;
  }

  seleccionarProveedor(event: MatAutocompleteSelectedEvent): void {
    this.dataSource.data = [event.option.value];
  }

  limpiarFiltro(): void {
    this.dataSource.data = this.proveedores;
    this.proveedorFiltrado = new Observable<Proveedor[]>();
    this.nombreControl.reset();
  }

  borrarProveedor(proveedor: Proveedor): void {
    Swal.fire({
      title: `¿Está seguro de eliminar al proveedor ${proveedor.nombre.toUpperCase()}?`,
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.deleteProveedor(proveedor).subscribe(() => {
          this.proveedores = this.proveedores.filter(p => p.id !== proveedor.id);
          Swal.fire(
            'Eliminado!',
            'El Proveedor ha sido eliminado.',
            'success'
          );
          this.calcularRangos();
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.error.mensaje,
          });
        });
      }
    });
  }

  openDetalle(proveedor: Proveedor): void {
    this.dialog.open(DetalleProveedorComponent, {
      width: '750px',
      data: proveedor,
      hasBackdrop: true
    });
  }

  openFormulario(tipo: string, proveedor?: Proveedor): void {
    let dialogRef;

    if (tipo === 'N') {
      dialogRef = this.dialog.open(FormularioProveedorComponent, {
        width: '900px',
        data: {},
        hasBackdrop: true
      });
    } else {
      dialogRef = this.dialog.open(FormularioProveedorComponent, {
        width: '900px',
        data: proveedor,
        hasBackdrop: true
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (!result || result === '') {
        return;
      } else {
        if (tipo === 'E') {
          const indexProveedor = this.proveedores.findIndex(p => p.id === proveedor.id);
          this.proveedores.splice(indexProveedor, 1, result);
          this.dataSource.data = this.proveedores;
        } else {
          this.loading = true;
          this.proveedores.push(result);
          this.calcularRangos();
        }
      }
    });
  }

  private filtrar(termino: string): Observable<Proveedor[]> {
    return this.proveedorService.getProveedoreFiltro(termino.toLowerCase());
  }

}
