
export enum ESTADOS{
  to_do = "to_do",
  in_progress = "in_progress",
  in_test = "in_test",
  closed = "closed", //se debera eliminar y de todas sus referencias
}

export type Empresa = {
  name: string;
  tareas : string[]; //id tareas que ha creado
  trabajadores : string[]; //id trabajadores que tiene MAX 10 trabajadores
};

export type Trabajador = {
  name: string;
  tareas : string[]; //id tareas que ha realizado MAX 10
  empresa : string | null; //id empresa a la que pertenece SOLO 1
};

export type Tarea = {
  name: string;
  estado: ESTADOS;
  trabajador: string; //id trabajador
  empresa: string; //id empresa que la crea
};
