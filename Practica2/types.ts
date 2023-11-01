
export type Producto = {
  name: string;
  stock: number;
  description: string;
  price: number;
};

export type Cliente = {
  name: string;
  cif: string;
};

export type Factura = {
  client: string;
  products: Producto[]; //vamos a lamacenar solo las id de productos
  total: number;
};

