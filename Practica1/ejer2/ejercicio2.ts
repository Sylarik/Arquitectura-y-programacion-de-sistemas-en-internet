
const funcionSeguridad=(contraseña: string): number =>{

    let cont=0;

    //1. convertir string en array
    const array: string[] =contraseña.split(''); //cada caracter de la contraseña ya esta en el array

    //2. Si tiene una letra y un numero sumará 1 +++++
    //lo he visto en https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions/Groups_and_backreferences
    //de esa pagina he aprendido como utilizar los rangos y la funcion .match()
    const letras= /[a-zA-Z]/
    const numeros= /[0-9]/
    
    const siLetra = array.some(p => p.match(letras))
    const siNumero = array.some(n => n.match(numeros))
    
    if(siLetra && siNumero){
        cont= cont + 1
    }

    //3. Si tiene tres números seguidos restará 1 
    //reutilizo el rango de numeros anterior
    for(let i=0; i<array.length-2; i++){
        if(array[i].match(numeros) && array[i+1].match(numeros) && array[i+2].match(numeros) ){
            cont= cont - 1;
            break; //si ya encuentra 3 numeros seguidos no sigue
            
        }else{}
    }


    //4. Si la contraseña supera los 20 caracteres sumará 2
    if(contraseña.length>20) cont=cont + 2

    //5. Si la contraseña es menor a 10 caracteres restará 1
    if(contraseña.length<10) cont= cont + 1

    //6. Si tiene caracteres especiales sumará 1
    if(array.some(elem => !elem.match(letras) || !elem.match(numeros))){
        cont=cont+1;
        
    }
    

    return cont;
}


console.log(funcionSeguridad("5!5n57"))