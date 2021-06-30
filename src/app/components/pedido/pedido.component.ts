import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {PagePedido, Pedido} from '../../models/pedido';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {PedidoService} from '../../services/pedido.service';
import {flatMap, map} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FormularioPedidoComponent} from './formulario-pedido/formulario-pedido.component';
import {DetallePedidoComponent} from './detalle-pedido/detalle-pedido.component';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

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
  public barChartLabels: Label[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [ 1000, 2500, 500, 1200, 3000, 600, 800, 1600, 2300, 1000, 4000, 5000], label: 'Pedidos' }
  ];

  pageSizeOptions: number[] = [3, 5, 10, 20, 50];
  totalElements = 0;
  nombreControl = new FormControl();
  page = 0;
  size = 4;
  pedidos: Pedido[] | any = [];
  pedidoFiltrado: Observable<Pedido[]>;
  displayedColumns: string[] = ['No. Pedido', 'Descripcion', 'Pago', 'Cliente', 'Fecha', 'Observaciones', 'Acciones'];
  dataSource: MatTableDataSource<Pedido[]>;
  loading = true;

  constructor(private pedidoService: PedidoService,
              private router: Router,
              public dialog: MatDialog,
              private paginator: MatPaginatorIntl) { }

  ngOnInit(): void {
    this.paginator.itemsPerPageLabel = 'Registros por página';
    this.calcularRangos();
  }

  filtrarPedido(): void {
    this.pedidoFiltrado = this.nombreControl.valueChanges.pipe(
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
    this.pedidoService.getPedidosPage(this.page.toString(), this.size.toString()).subscribe((pedido: PagePedido) => {
      this.loading = false;
      this.pedidos = pedido.content;
      this.totalElements = pedido.totalElements as number;
      this.dataSource = new MatTableDataSource<Pedido[]>(this.pedidos);
    }, () => {
      this.router.navigate(['/error']);
    });
  }

  mostrarNombre(pedido?: Pedido): string | undefined {
    return pedido ? pedido.cliente.nombre : undefined;
  }

  seleccionarPedido(event: MatAutocompleteSelectedEvent): void {
    this.dataSource.data = [event.option.value];
  }

  limpiarFiltro(): void {
    this.dataSource.data = this.pedidos;
    this.pedidoFiltrado = new Observable<Pedido[]>();
    this.nombreControl.reset();
  }

  openFormulario(): void {
    let dialogRef;

    dialogRef = this.dialog.open(FormularioPedidoComponent, {
      width: '1100px',
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || result === '') {
        return;
      } else {
          this.loading = true;
          this.pedidos.push(result);
          this.calcularRangos();
        }
    });
  }

  openDetalle(pedido: Pedido): void {
    this.dialog.open(DetallePedidoComponent, {
      width: '60%',
      data: pedido,
      hasBackdrop: true
    });
  }

  private filtrar(termino: string): Observable<Pedido[]> {
    return this.pedidoService.getPedidoFiltro(termino.toLowerCase());
  }

}
