import { Component, OnInit } from '@angular/core';
import {PageProducto, Producto} from '../../models/producto';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {ProductoService} from '../../services/producto.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PageEvent, MatPaginatorIntl} from '@angular/material/paginator';
import {flatMap, map} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import Swal, {SweetAlertResult} from 'sweetalert2';
import {FormularioProductoComponent} from './formulario-producto/formulario-producto.component';
import {DetalleProductoComponent} from './detalle-producto/detalle-producto.component';
import {Categoria} from '../../models/categoria';
import {CategoriaService} from '../../services/categoria.service';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';



@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Productos con Stock Limitado' }
  ];
  productosFiltrados: Producto[] | any = [];
  productos: Producto[] | any = [];
  categorias: Categoria[] = [];
  nombreControl = new FormControl();
  productoFiltrado: Observable<Producto[]>;
  displayedColumns: string[] = ['No.', 'Nombre', 'Precio', 'Cantidad', 'Categoria', 'Estado', 'Fecha', 'Acciones'];
  dataSource: MatTableDataSource<Producto[]>;
  loading = true;
  pageSizeOptions: number[] = [3, 5, 10, 20, 50];
  totalElements = 0;
  page = 0;
  size = 4;


  constructor(private service: ProductoService,
              private router: Router,
              public dialog: MatDialog,
              public categoriaService: CategoriaService,
              private paginator: MatPaginatorIntl) { }

  ngOnInit(): void {
    this.paginator.itemsPerPageLabel = 'Registros por página';
    this.generarGrafica();
    this.calcularRangos();
    this.cargarCategorias();
  }

  generarGrafica(): void {
    this.service.getProductos().subscribe(product => {
      this.productosFiltrados = product.filter(p => p.cantidad <= 10);
      this.productosFiltrados.forEach(p => {
        this.barChartLabels.push(p.nombre);
        this.barChartData[0].data.push(p.cantidad);
      });
    });
    this.productosFiltrados.slice(0, 3);
    this.barChartLabels.slice(0 , 3);
    this.barChartData[0].data.slice(0, 3);
  }

  calcularRangos(): void {
    this.service.getProductosPage(this.page.toString(), this.size.toString()).subscribe((producto: PageProducto) => {
      this.loading = false;
      this.productos = producto.content;
      this.totalElements = producto.totalElements as number;
      this.dataSource = new MatTableDataSource<Producto[]>(this.productos);
    }, () => {
      this.router.navigate(['/error']);
    });
  }

  paginar(event: PageEvent): void {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.calcularRangos();
  }

  filtrarProductos(): void {
    this.productoFiltrado = this.nombreControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      flatMap(value => value ? this.filtrar(value) : []),
    );
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  limpiarFiltro(): void {
    this.dataSource.data = this.productos;
    this.productoFiltrado = new Observable<Producto[]>();
    this.nombreControl.reset();
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    this.dataSource.data = [event.option.value];
  }

  openDetalleProducto(producto: Producto): void {
    this.dialog.open(DetalleProductoComponent, {
      width: '750px',
      data: producto,
      hasBackdrop: true
    });
  }

  openFormulario(tipo: string, producto?: Producto): void {
    let dialogRef;

    if (tipo === 'N') {
      dialogRef = this.dialog.open(FormularioProductoComponent, {
        width: '500px',
        data: [this.categorias],
        hasBackdrop: true
      });
    } else {
      dialogRef = this.dialog.open(FormularioProductoComponent, {
        width: '500px',
        data: [this.categorias, producto],
        hasBackdrop: true
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (!result || result === '') {
        return;
      } else {
        if (tipo === 'E') {
          const indexCliente = this.productos.findIndex(c => c.id === producto.id);
          this.productos.splice(indexCliente, 1, result);
          this.dataSource.data = this.productos;
        } else {
          this.loading = true;
          this.productos.push(result);
          this.calcularRangos();
        }
      }
    });
  }

  borrarProducto(producto: Producto): void {
    Swal.fire({
      title: `¿Está seguro de eliminar el producto ${producto.nombre.toUpperCase()}?`,
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.service.deleteProducto(producto).subscribe(() => {
          this.productos = this.productos.filter(p => p.id !== producto.id);
          Swal.fire(
            'Eliminado!',
            'El producto ha sido eliminado.',
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

  private filtrar(termino: string): Observable<Producto[]> {
    return this.service.getProductoFiltro(termino.toLowerCase());
  }

  private cargarCategorias(): void {
    this.loading = true;
    this.categoriaService.getCategorias().subscribe((categorias: Categoria[]) => {
      this.loading = false;
      this.categorias = categorias;
    }, () => {
      this.router.navigate(['/error']);
    });
  }
}
