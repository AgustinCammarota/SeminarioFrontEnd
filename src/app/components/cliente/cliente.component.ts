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

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  pageSizeOptions: number[] = [3, 5, 10, 20, 50];
  totalElements = 0;
  nombreControl = new FormControl();
  page = 0;
  size = 4;
  clientes: Cliente[] | any = [];
  clienteFiltrado: Observable<Cliente[]>;
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

  calcularRangos(): void {
    this.clienteService.getClientesPage(this.page.toString(), this.size.toString()).subscribe((cliente: PageCliente) => {
      this.loading = false;
      this.clientes = cliente.content;
      this.totalElements = cliente.totalElements as number;
      this.dataSource = new MatTableDataSource<Cliente[]>(this.clientes);
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

}
