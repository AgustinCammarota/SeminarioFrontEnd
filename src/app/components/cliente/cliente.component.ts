import {Component, OnInit} from '@angular/core';
import {ClienteService} from '../../services/cliente.service';
import {Cliente, PageCliente} from '../../models/cliente';
import {MatTableDataSource} from '@angular/material/table';
import {PageEvent, MatPaginatorIntl} from '@angular/material/paginator';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {FormularioClienteComponent} from './formulario-cliente/formulario-cliente.component';
import {Pedido} from '../../models/pedido';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Label} from "ng2-charts";
import {DetalleClienteComponent} from "./detalle-cliente/detalle-cliente.component";

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

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
  public barChartLabels: Label[] = ['2016', '2017', '2018', '2019', '2020', '2021'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Clientes' }
  ];

  pageSizeOptions: number[] = [3, 5, 10, 20, 50];
  totalElements = 0;
  nombreControl = new FormControl();
  page = 0;
  size = 4;
  clientes: Cliente[] | any = [];
  clienteFiltrado: Observable<Cliente[]>;
  clienteDelMes: Cliente;
  displayedColumns: string[] = ['No.', 'Nombre', 'Correo', 'DNI', 'Telefono', 'Fecha', 'Acciones'];
  dataSource: MatTableDataSource<Cliente[]>;
  loading = true;

  constructor(private clienteService: ClienteService,
              private router: Router,
              public dialog: MatDialog,
              private paginator: MatPaginatorIntl) { }

  ngOnInit(): void {
    this.paginator.itemsPerPageLabel = 'Registros por página';
    this.calcularRangos();
  }

  filtrarCliente(): void {
    this.clienteFiltrado = this.nombreControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      flatMap(value => value ? this.filtrar(value) : []),
    );
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.calcularRangos();
  }

  obtenerClienteDelMes(): void {
    this.clienteService.getClientes().subscribe(clientes => {
      clientes.forEach((cliente: Cliente) => {
        if (!this.clienteDelMes || cliente.pedidos.length > this.clienteDelMes.pedidos.length) {
          this.clienteDelMes = cliente as Cliente;
        }
      });
    }, () => {
      this.router.navigate(['/error']);
    });
  }

  calcularRangos(): void {
    this.clienteService.getClientesPage(this.page.toString(), this.size.toString()).subscribe((cliente: PageCliente) => {
      this.loading = false;
      this.clientes = cliente.content;
      this.totalElements = cliente.totalElements as number;
      this.dataSource = new MatTableDataSource<Cliente[]>(this.clientes);
      this.obtenerClienteDelMes();
    }, () => {
      this.router.navigate(['/error']);
    });
  }

  mostrarNombre(cliente?: Cliente): string | undefined {
    return cliente ? cliente.nombre : undefined;
  }

  seleccionarCliente(event: MatAutocompleteSelectedEvent): void {
    this.dataSource.data = [event.option.value];
  }

  limpiarFiltro(): void {
    this.dataSource.data = this.clientes;
    this.clienteFiltrado = new Observable<Cliente[]>();
    this.nombreControl.reset();
  }

  borrarCliente(cliente: Cliente): void {
    Swal.fire({
      title: `¿Está seguro de eliminar al cliente ${cliente.nombre.toUpperCase()}?`,
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(cliente).subscribe(() => {
          this.clientes = this.clientes.filter(c => c.id !== cliente.id);
          Swal.fire(
            'Eliminado!',
            'El cliente ha sido eliminado.',
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

  openDetalleCliente(cliente): void {
    this.dialog.open(DetalleClienteComponent, {
      width: '1000px',
      data: cliente,
      hasBackdrop: true
    });
  }

  openFormulario(tipo: string, cliente?: Cliente): void {
    let dialogRef;

    if (tipo === 'N') {
      dialogRef = this.dialog.open(FormularioClienteComponent, {
        width: '400px',
        data: {},
        hasBackdrop: true
      });
    } else {
      dialogRef = this.dialog.open(FormularioClienteComponent, {
        width: '400px',
        data: cliente,
        hasBackdrop: true
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (!result || result === '') {
        return;
      } else {
        if (tipo === 'E') {
          const indexCliente = this.clientes.findIndex(c => c.id === cliente.id);
          this.clientes.splice(indexCliente, 1, result);
          this.dataSource.data = this.clientes;
        } else {
          this.loading = true;
          this.clientes.push(result);
          this.calcularRangos();
        }
      }
    });
  }

  private filtrar(termino: string): Observable<Cliente[]> {
    return this.clienteService.getClienteFiltro(termino.toLowerCase());
  }

  get obtenerTotalPedidos(): number {
    return !this.clienteDelMes ? 0 : this.clienteDelMes.pedidos.reduce((contadorTotal: number, current: Pedido) => {
      contadorTotal = (contadorTotal || 0) + current.total;
      return contadorTotal;
    }, 0);
  }

}
