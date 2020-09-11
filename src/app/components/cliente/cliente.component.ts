import {Component, OnInit} from '@angular/core';
import {ClienteService} from '../../services/cliente.service';
import {Cliente, PageCliente} from '../../models/cliente';
import {MatTableDataSource} from '@angular/material/table';
import {PageEvent} from '@angular/material/paginator';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

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
  clientes: Cliente[] = [];
  cliente: PageCliente | Cliente | any = {};
  clienteFiltrado: Observable<Cliente[]>;
  displayedColumns: string[] = ['No.', 'Nombre', 'Correo', 'DNI', 'Telefono', 'Fecha', 'Acciones'];
  dataSource: MatTableDataSource<Cliente[]>;
  loading = true;

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.calcularRangos();

    this.clienteFiltrado = this.nombreControl.valueChanges.pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this.filtrar(value) : [])
    );
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.calcularRangos();
  }

  calcularRangos(): void {
    this.clienteService.getClientesPage(this.page.toString(), this.size.toString()).subscribe(cliente => {
      this.cliente = cliente;
      this.loading = false;
      this.totalElements = cliente.totalElements as number;
      this.dataSource = new MatTableDataSource<Cliente[]>(this.cliente.content);
      this.cargarClientes();
    }, error => {
      console.log(error);
    });
  }

  mostrarNombre(cliente?: Cliente): string | undefined {
    return cliente ? cliente.nombre : undefined;
  }

  seleccionarCliente(event: MatAutocompleteSelectedEvent): void {
    const clienteSelect = event.option.value as Cliente;
    // @ts-ignore
    this.dataSource.data = this.clientes.filter(cliente => cliente.id === clienteSelect.id);
  }

  private filtrar(termino: string): Observable<Cliente[]> {
    return this.clienteService.getClienteFiltro(termino.toLowerCase());
  }

  private cargarClientes(): void {
    this.loading = true;
    this.clienteService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
      this.loading = false;
    }, error => {
      console.log(error);
    });
  }

}
