import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {flatMap, map} from 'rxjs/operators';
import {Cliente} from '../../../models/cliente';
import {Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ClienteService} from '../../../services/cliente.service';
import {Producto} from '../../../models/producto';
import {ProductoService} from '../../../services/producto.service';
import Swal from 'sweetalert2';
import {LineaPedido, Pedido} from '../../../models/pedido';
import {Provincia} from '../../../models/provincia';
import {ProvinciaService} from '../../../services/provincia.service';
import {PedidoService} from '../../../services/pedido.service';
import {Direccion} from '../../../models/direccion';
import {Factura} from '../../../models/factura';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-formulario-pedido',
  templateUrl: './formulario-pedido.component.html',
  styleUrls: ['./formulario-pedido.component.css']
})
export class FormularioPedidoComponent implements OnInit {
  formularioCliente: FormGroup;
  formularioDireccion: FormGroup;
  seleccionCliente = new FormControl();
  filtroCliente = new FormControl();
  filtroProducto = new FormControl();
  seleccionEnvio = new FormControl();
  seleccionPago = new FormControl();
  observacion = new FormControl();
  descripcion = new FormControl();
  lineaPedido: LineaPedido[] = [];
  provincias: Provincia[] = [];
  pedido: Pedido;
  direccion: Direccion;
  cliente: Cliente | any = {};
  productos: Producto[] | any = [];
  clienteFiltrado: Observable<Cliente[]>;
  productoFiltrado: Observable<Producto[]>;

  constructor(private formBuilder: FormBuilder,
              private clienteService: ClienteService,
              private productoService: ProductoService,
              private provinciaService: ProvinciaService,
              private pedidoSevice: PedidoService,
              private dialogRef: MatDialogRef<FormularioPedidoComponent>) { }

  ngOnInit(): void {
    this.seleccionEnvio.patchValue('R');
    this.seleccionPago.patchValue('E');
    this.crearFormularioCliente();
    this.crearFormularioDireccion();
  }

  filtrarCliente(): void {
    this.clienteFiltrado = this.filtroCliente.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      flatMap(value => value ? this.filtrarCli(value) : []),
    );
  }

  seleccionarCliente(event: MatAutocompleteSelectedEvent): void {
    this.cliente = event.option.value;
  }

  limpiarFiltro(tipo: string): void {
    if (tipo === 'C') {
      this.cliente = {};
      this.clienteFiltrado = new Observable<Cliente[]>();
      this.filtroCliente.reset();
    } else {
      this.productoFiltrado = new Observable<Producto[]>();
      this.filtroProducto.reset();
    }
  }

  mostrarNombreCliente(cliente?: Cliente): string | undefined {
    return cliente ? cliente.nombre : undefined;
  }

  filtrarProductos(): void {
    this.productoFiltrado = this.filtroProducto.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      flatMap(value => value ? this.filtrarPro(value) : []),
    );
  }

  cargarProvincias(): void {
    console.log(this.seleccionEnvio.value);
    if (this.seleccionEnvio.value === 'E') {
      this.provinciaService.getProvincias().subscribe(provincias => {
        this.provincias = provincias;
      }, () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al cargar las provincias',
        });
      });
    }
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto;
    if ((this.lineaPedido.length > 0 && this.lineaPedido.findIndex(p => p.producto.id === producto.id) < 0)
      || this.lineaPedido.length === 0 && producto.cantidad !== 0) {

      this.lineaPedido.push(new LineaPedido(1, producto));

    } else {
      Swal.fire(
        {
          icon: 'error',
          title: 'Error al seleccionar el producto',
          text: producto.cantidad === 0 ? 'El producto seleccionado se encuentra sin stock' : 'El producto ya se encuentra seleccionado',
        });
    }
  }

  mostrarNombreProducto(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  borrarProducto(item: LineaPedido): void {
    this.lineaPedido = this.lineaPedido.filter(lp => lp.producto.id !== item.producto.id);
  }

  actulizarCantidad(item: LineaPedido, event: any): void {
    const cantidad: number = event.target.value as number;

    if (cantidad <= 0) {
      return this.borrarProducto(item);
    }

    this.lineaPedido = this.lineaPedido.map((lp: LineaPedido) => {
      if (item.producto.id === lp.producto.id) {
        if (item.producto.cantidad - cantidad >= 0) {
          lp.cantidad = cantidad;
        } else {
          lp.cantidad = item.producto.cantidad;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay stock suficiente del producto seleccionado',
          });
        }
      }
      return lp;
    });
  }

  generarPedido(): void {

    if (this.seleccionCliente.value === 'N') {
      this.cliente = new Cliente(
        this.formularioCliente.value.nombre,
        this.formularioCliente.value.email,
        this.formularioCliente.value.dni,
        this.formularioCliente.value.telefono
      );
    }

    if (this.seleccionEnvio.value === 'E') {
      this.direccion = new Direccion(
        this.formularioDireccion.value.cp,
        this.formularioDireccion.value.calle,
        this.formularioDireccion.value.numero,
        this.formularioDireccion.value.localidad,
        this.formularioDireccion.value.provincia,
        this.formularioDireccion.value.departamento
      );
    }

    this.lineaPedido  = this.lineaPedido.map(lp => {
      lp.producto.cantidad = lp.producto.cantidad - lp.cantidad;
      return lp;
    });

    this.pedido = new Pedido(
      this.descripcion.value,
      this.seleccionPago.value === 'E' ? 'EFECTIVO' : 'TARJETA',
      this.cliente,
      this.lineaPedido,
      this.seleccionEnvio.value === 'E' ? this.direccion : null,
      new Factura(this.obtenerNumeracion),
      this.observacion.value);

    Swal.fire({
      title: `¿Está seguro de querer generar el pedido a nombre de ${this.pedido.cliente.nombre}?`,
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, generarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidoSevice.savePedido(this.pedido).subscribe(pedido => {
          this.dialogRef.close(pedido);
          Swal.fire(
            'Generado!',
            'El pedido ha sido generado con exito.',
            'success'
          );
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

  get obtenerNumeracion(): string {
    const aleatorioUno = Math.round(Math.random() * 5);
    const aleatorioDos = Math.round(Math.random() * 5);
    let fecha = new Date().toISOString();
    return  this.cliente.id +  + ' ' + aleatorioUno + ' - ' + aleatorioDos;
  }

  get validarClienteVacio(): boolean {
    return Object.keys(this.cliente).length === 0;
  }

  get nombreNovalido(): boolean {
    return this.formularioCliente.get('nombre').invalid &&
      this.formularioCliente.get('nombre').touched &&
      this.formularioCliente.get('nombre').errors.pattern;
  }

  get emailNovalido(): boolean {
    return this.formularioCliente.get('email').invalid &&
      this.formularioCliente.get('email').touched &&
      !this.formularioCliente.get('email').errors.required;
  }

  get dniNovalido(): boolean {
    return this.formularioCliente.get('dni').invalid &&
      this.formularioCliente.get('dni').touched &&
      !this.formularioCliente.get('dni').errors.required;
  }

  get telefonoNovalido(): boolean {
    return this.formularioCliente.get('telefono').invalid &&
      this.formularioCliente.get('telefono').touched &&
      !this.formularioCliente.get('telefono').errors.required;
  }

  get localidadNoValida(): boolean {
    return this.formularioDireccion.get('localidad').invalid &&
      this.formularioDireccion.get('localidad').touched &&
      !this.formularioDireccion.get('localidad').errors.required;
  }

  get departamentoNovalido(): boolean {
    return this.formularioDireccion.get('departamento').invalid &&
      this.formularioDireccion.get('departamento').touched &&
      !this.formularioDireccion.get('departamento').errors.required;
  }

  get obtenerTotalPago(): number {
    let total = 0;
    this.lineaPedido.forEach((item: LineaPedido) => {
      total = total + item.calcularImporte();
    });
    return  total;
  }

  private filtrarCli(termino: string): Observable<Cliente[]> {
    return this.clienteService.getClienteFiltro(termino.toLowerCase());
  }

  private filtrarPro(termino: string): Observable<Producto[]> {
    return this.productoService.getProductoFiltro(termino.toLowerCase());
  }

  private crearFormularioCliente(): void {
    this.formularioCliente = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
      dni: ['', [Validators.required]],
      telefono: ['']
    });
  }

  private crearFormularioDireccion(): void {
    this.formularioDireccion = this.formBuilder.group({
      calle: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      departamento: ['', [Validators.pattern('^[a-zA-Z-0-9 ]+$')]],
      localidad: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      cp: ['', [Validators.required]],
      provincia: ['', [Validators.required]]
    });
  }

}
