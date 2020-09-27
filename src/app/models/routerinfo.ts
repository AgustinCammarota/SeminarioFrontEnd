
export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
  { path: '/clientes', title: 'Clientes',  icon: 'person', class: '' },
  { path: '/pedidos', title: 'Pedidos',  icon: 'receipt', class: '' },
  { path: '/productos', title: 'Productos',  icon: 'shopping_cart', class: '' },
  { path: '/proveedores', title: 'Proveedores',  icon: 'airport_shuttle', class: '' },
  { path: '/reportes', title: 'Reportes',  icon: 'description', class: '' },
  { path: '/usuario', title: 'Usuarios',  icon: 'supervised_user_circle', class: '' }
  ];
