

const formato24h=(miHora: string) : string=> {

    const division=miHora.split(/ |:/) //dividir la hora en horas, minutos y si es am o pm cuando encuente o un especio o :, utilizando regex
    //visto en https://www.freecodecamp.org/espanol/news/el-split-de-javascript-como-dividir-una-cadena-de-caracteres-en-un-arreglo-con-js/

    //almacenamos cada parte del array con su correspondencia
    let hora= division[0]       //es let ya que puede ser modificada a continuacion 
    const minuto= division[1]
    const tiempo= division[2]

    if(tiempo === "am"){
        if(parseInt(hora)<10 && parseInt(hora)!=0){  //siendo 'am', si es solo un digito le añadimos un 0 para que quede 05 por ejmplo
            hora=0+hora
        }else 
        if(parseInt(hora)===12) hora="00"           
    }
    else if (tiempo === "pm" && parseInt(hora)!=12){ 
        
        hora=(parseInt(hora)+12).toString()          //siendo 'pm', sumamos 12 a la hora para el formado 24h
    }

    return hora+minuto  //devollvemos la hora y el minuto juntos

}

console.log(formato24h("08:05 pm"))