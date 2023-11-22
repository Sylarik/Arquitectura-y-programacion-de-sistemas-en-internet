
export type Cliente = {
  name: string;
  dni: string;
  dinero: number;
  gestor: string; //id gestor
  hipotecas: string[]; //hacer excepcion de que no puede haber una de mas de 1M
  historial: string[];
};

export type Hipoteca = {
  cuota: number; //siempre 20
  importe: number; //de cuanto es la hipoteca
  cliente: string; //guarda solo el id de los clientes
  gestor: string; //guarda solo el id de los gestores
};

export type Gestor = {
  name: string;
  clientes: string[]; //solo id clientes y excepcion de q max 10 clientes
  dni: string;
};
