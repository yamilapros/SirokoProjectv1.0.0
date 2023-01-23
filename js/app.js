document.addEventListener('DOMContentLoaded', () => {
    //Función para pasar de "step" a "step"
    nextStep();

    //Guardar datos de las respuestas del usuario (número de año y string)
    saveDataInput();

    //Verifico si ya se ha generado el código de descuento
    const codeActivate = checkCodeAndActivate();
    if(codeActivate){
        //Copiar al portapapeles
        copyToClipboard();

        //Contador cuenta regresiva
        countDownTimer();
    }
});


//============GUARDAR DATOS =======================================================
const saveDataInput = () => {
    let buttons = document.querySelectorAll('.step__button--next');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            let arr = saveData();
            let number = generateNumberOfDiscountCode(arr);
            let string = generateStringOfDiscountCode(arr);
            //Mando datos para generar código de descuento en HTML
            generateDiscountCodeInHtml(number, string);
        })
    });
}

//Funcion para captar datos
const saveData = () => {
    const arrData = [];
    let radiosYear = document.getElementsByName('year');
    for (let radio of radiosYear){
        if (radio.checked) {
            let yearData = radio.value;
            arrData.push(yearData)
        }
    }
    let radiosOption = document.getElementsByName('option');
    for (let radio of radiosOption){
        if (radio.checked) {
            //Voy a sacar el texto del label, por si la última palabra no llegara a 4 caracteres
            let labelText = radio.nextElementSibling;
            const optionData = labelText.innerHTML;
            // let optionData = radio.value;
            arrData.push(optionData);
        }
    }
    return arrData;        
}

//============FUNCIONES AUXILIARES PARA GENERAR CÓDIGO DE DESCUENTO =======================================================
//Función para verificar cuántos dígitos tiene un número
const checkQuantityDigits = (value) => {
    const digits = value.toString().length;
    return digits;
}
//Función para sumar y reducir un número
const addAndReduceNumbers = (value) => {
    //01 - Convertir en String
    value = value.toString();
    //02- Generar array con los números por separado
    numbers = value.split('');
    //03- Sumar los números
    let initialValue = 0;
    const sumResult = numbers.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue),initialValue);
    //04- Retornar el resultado
    return sumResult;
}

//Función que imrpime en pantalla el código d descuento
const generateDiscountCodeInHtml = (number, string) => {
    let discountCode = generateDiscountCode(number, string);
    //Muestro el código de descuento en HTML
    document.querySelector('.step__discount-code').value = discountCode;
    checkCodeAndActivate(discountCode);
}
//Función que verifica que se haya generado ya el código de descuento para dar paso a la activación de 
//"copiar a portapapeles" y "cuenta regresiva"
const checkCodeAndActivate = (code = '') => {
    return true;
}

//============GENERAR CÓDIGO DE DESCUENTO =======================================================
// 01- Paso 1: Funcion para generar el número del codigo de descuento
const generateNumberOfDiscountCode = (arr) => {
    //01- Recibo el año
    const numberData = arr[0];
    //02- Obtengo los 2 últimos números
    const lastTwoNumbers = numberData.substring(2, numberData.length);
    //03- Llamar a la función para sumar y reducir y obtener resultado
    let result = addAndReduceNumbers(lastTwoNumbers);
    //04- Compruebo cuántos dígitos me devuleve la suma, si tengo 2 es que me ha devuelto un "0"
    const digits = checkQuantityDigits(result);
    //Si tengo más de 2 dígitos, vuelvo a sumar y reducir
    if(digits === 2){
        result = addAndReduceNumbers(result);
    }
    //05- Devolver resultado
    return result;
}
// 02- Paso 2: Función para generar el texto del codigo de descuento
const generateStringOfDiscountCode = (arr) => {
    //01- Recibo el texto y lo convierto a mayúsculas
    let textData = arr[1].toUpperCase();
    //02- Suprimo todos los espacios en blanco
    textData = textData.split(" ").join("");
    //02- Voy a hacer un match solo con letras "a" y las elimino
    let textDataNew = textData.split("A").join(''); 
    //03- Obtengo los 4 últimos caracteres
    const lastFourCharacters = textDataNew.substring(textDataNew.length - 4);
    //04- Retorno el resultado
    return lastFourCharacters;
}
//03- Funcion para generar código de descuento completo
const generateDiscountCode = (number, string) => {
    //01- Recibo número y texto y los concateno
    const discountCode = number + string;
    return discountCode;
}

//============COPIAR AL PORTAPAPELES CÓDIGO DE DESCUENTO =================================
const copyToClipboard = () => {
    const element = document.querySelector('.step__discount-code');
    const buttonToCopy = document.querySelector('.step__button-copy');
    buttonToCopy.addEventListener('click', () => {
        element.select();
        document.execCommand('copy');
        buttonToCopy.classList.remove('step__button-copy');
        buttonToCopy.classList.add('step__button-copied');
        buttonToCopy.innerText = '¡Copiado!';
        //Cuando el usuario de click, el texto dejará de estar copiado
        const body = document.querySelector('body');
        body.addEventListener('click', (e) => {
            let element = e.target;
            if(!element.classList.contains('step__button-copied')){
                buttonToCopy.classList.remove('step__button-copied');
                buttonToCopy.classList.add('step__button-copy');
                buttonToCopy.innerText = 'Copiar';
            }
        });
    });
}

//============TEMPORIZADOR CUENTA REGRESIVA ==============================================
const HideCountdownAndShowAlert = () => {
    const divCountDownTimer = document.querySelector('.step__clock');
    const divAlert = document.querySelector('.step__error');
    divCountDownTimer.classList.add('hidden-element');
    divAlert.classList.remove('hidden-element');
    divAlert.classList.add('show-element');
}

const paddedFormat = (num) => {
    return num < 10 ? "0" + num : num; 
}
const startCountDown = (duration, element) => {
    let secondsRemaining = duration;
    let min = 0;
    let sec = 0;

    let countInterval = setInterval(function () {

        min = parseInt(secondsRemaining / 60);
        sec = parseInt(secondsRemaining % 60);

        element.textContent = `${paddedFormat(min)}:${paddedFormat(sec)}`;

        secondsRemaining = secondsRemaining - 1;
        if (secondsRemaining < 0){
            clearInterval(countInterval);
            //Mostrar div de alerta y ocultar div de contador
            HideCountdownAndShowAlert();
        }
    }, 1000);
}
const countDownTimer = () => {
    //Aquí se establecen los minutos y segundos
    let timeMinutes = 20; 
    let timeSeconds = 0;

    let duration = timeMinutes * 60 + timeSeconds;

    element = document.querySelector('#countdown-timer');
    element.textContent = `${paddedFormat(timeMinutes)}:${paddedFormat(timeSeconds)}`;

    startCountDown(--duration, element);
}

//============PASAR DE STEP A STEP =======================================================
const nextStep = () => {
    let buttons = document.querySelectorAll('.step__button--next');

    buttons.forEach((button) => {
        button.addEventListener('click', function(){
            if(button){
            //Capto step actual
            let currentStep = document.getElementById('step-' + button.dataset.step);
            //Capto siguiente step
            let nextStep = document.getElementById('step-' + button.dataset.to_step);
            //Aplico clases
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
    
            currentStep.classList.add('to-left');
            
            currentStep.classList.add('inactive');
            nextStep.classList.remove('inactive');
            }
        })
    });
}





