# Arquitectura-y-programacion-de-sistemas-en-internet

## Practica 3 
### Endpoints:
- .post("/client", addCliente) : nos permitirá crear los clientes de nuestro banco
  - parametros:
    - obligatorios: nombre del cliente, dni, dinero inicial al crear su cuenta
    - opcionales: gestor asignado, hipotecas(array), historial(array)
      
- .delete("/client/:id", deleteCliente) : con ello borraremos clientes
  - :id -> será el _id de mongo del cliente que queramos borrar
  - comprobaciones:
    - solo se podrá borrar si no tiene ninguna hipoteca
    - cuando se borre tambien se tendrá que borrar del array de clientes del gestor
    
- .post("/hipoteca", addHipoteca) : permite crear hipotecas
  - parametros:
      - obligatorios: importe, cliente
      - opcionales: cuota (siempre va a ser 20 pero la podrias cambiar si quieres)
      
- .post("/gestor", addGestor) : nos permitirá crear los gestores de nuestro banco
  - parametros:
      - obligatorios: name(nombre del gestor), dni
      - opcionales: clientes (luego los podras añadir asi que no hace falta hacerlo de primeras)
        
- .put("/client/:id", updateSaldoCliente) : podremos ingresa una cantidad de dinero a un cliente
  - :id -> será el _id de mongo del cliente al que quieres ingresar dinero
  - parametros:
      - dinero: la cantidad que añadiras a "dinero"
    
- .put("/receptor/:id", updateEnvioDinero) : podremos enviar una cantidad de dinero de un cliente a otro del banco
  - :id -> será el _id de mongo del cliente emisor, el que enviará una cantidad de dinero a otro cliente
  - parametros:
    - receptor: _id de mongo del cliente al que le va a llegar el dinero del cliente emisor
    - dinero: cantidad de dinero que se va a transferir
    
- .put("/amortizar/:id", amortizarHipoteca) : podremos hacer amortizaciones sobre las hipotecas de un cliente
  - :id -> será el _id de mongo del cliente al cual queremos amortizar una hipoteca
  - parametros:
      - hipoteca: pondremos el _id de mongo de la hipoteca del cliente que queremos utilizar

  
- .put("/anadirgestora/:id", updateGest_Cliente) : podremos asignar un gestor a un cliente, los dos del banco
  - :id -> será el _id de mongo del cliente al que queremos asignar un gestor
  - parametros:
      - gestor: pondremos el _id de mongo del gestor que queremos asignar al cliente



### Types
Hay 3 types que son : Cliente, Gestor, Hipoteca. Para cada uno de ellos crearemos un esquema.

### Extra
Como apartados extra teniamos que hacer dos funciones:
- que cada 5 minutos se ingresaran a todos los clientes del banco 10000€, la cual esta en "ingresar5min.ts"
- que cada 5 minutos se pagaran las cuotas de las hipotecas, la cual esta "amortizar5min.ts"
