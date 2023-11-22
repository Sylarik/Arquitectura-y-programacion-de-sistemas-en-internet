# Arquitectura-y-programacion-de-sistemas-en-internet

Practica 3
Endpoints:
- .post("/client", addCliente) : nos permitirá crear los clientes de nuestro banco
  - parametros: 
- .delete("/client/:id", deleteCliente) : con ello borraremos clientes
- .post("/hipoteca", addHipoteca) : permite crear hipotecas
- .post("/gestor", addGestor) : nos permitirá crear los gestores de nuestro banco
- .put("/client/:id", updateSaldoCliente) : podremos ingresa una cantidad de dinero a un cliente
- .put("/receptor/:id", updateEnvioDinero) : podremos enviar una cantidad de dinero de un cliente a otro del banco
- .put("/amortizar/:id", amortizarHipoteca) : podremos hacer amortizaciones sobre las hipotecas de un cliente
- .put("/anadirgestora/:id", updateGest_Cliente) : podremos asignar un gestor a un cliente, los dos del banco
