//ejer1: Hacer una función que tenga un parámetro de entrada que sea un array y en el cual se implemente un algoritmo de ordenación Bubble sort 

const miArray = [2,6,7,3,5]

export const bubbleSort = (array: number[]) => {
    bubbleSortRecursivo(miArray, miArray.length);

}

//como debe ser recursivo creamos otra funcion en la que le pasamos la longitud del array, que irá disminuyendo a medida que se vayan ordenando desde el final
const bubbleSortRecursivo = (array: number[], longitud: number) => {

    if(longitud === 1){
        return array;
    }

    for(let i=0; i< longitud ; i++){
        if(array[i]> array[i+1]){

            //cambiamos las posiciones
            let aux= array[i]
            array[i]= array[i+1]
            array[i+1]= aux
        }
    }

    return bubbleSortRecursivo(array, longitud -1) //devolvemos la propia funcion, pero con una longitud menor

}

bubbleSort(miArray)
console.log(miArray)





