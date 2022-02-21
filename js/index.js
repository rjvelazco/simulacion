// Elementos del DOM
const $container = document.querySelector("#table-container");
const $tableResult = document.querySelector("#table-results");

// Virtual Scroll
let datosNoAgregados = [];
let lastIndex = 0;
let maxPruebas = 100;

// Direcciones
const geo = { SUR: 1, NORTE: 2, ESTE: 3, OESTE: 4 };

// Numero Aleatorio
function getRandom(min, max) {
  return Math.trunc(Math.random() * (max - min) + min);
}

// Calculo
function getResult() {
  let dirX = 0;
  let dirY = 0;
  for (let i = 0; i < 10; i++) {
    const point = getRandom(1, 5); // Numero del 1 al 4
    if (point === geo["SUR"]) {
      dirY += 1; // Eje Y
    } else if (point === geo["NORTE"]) {
      dirY -= 1; // Eje Y
    } else if (point === geo["ESTE"]) {
      dirX += 1; // Eje X
    } else if (point === geo["OESTE"]) {
      dirX -= 1; // Eje X
    }
  }
  return Math.abs(dirX) + Math.abs(dirY); // si dirX + dirY === 2... Entonces es positivo el resultado
}

// Simulacion
const simulation = () => {
  cleanLastSimulation();

  const intentos = 100000;
  // for (let i = 0; i < pruebas; i++) {
  const resultados = [];

  for (let i = 0; i < intentos; i++) {
    // Obtenemos todos los resultados
    resultados.push(getResult());
  }

  // Regla de 3.
  // Intentos ---> 100%
  // Resultados ---> x%
  const resultado = Math.trunc(
    (resultados.filter((item) => item === 2).length * 100) / intentos
  );

  // Rellenar el HTML
  fillListadoPruebas(resultados);
  fillInputsData(resultado, intentos);
  showContent();
};

const fillListadoPruebas = (resultados = []) => {
  let str = "";

  for (let i = 0; i < maxPruebas; i++) {
    const result = resultados[i];
    const success = result === 2;
    str += `<tr><td>${i + lastIndex + 1}</td><td class="${
      success ? "test-success" : "test-fail"
    }">${success}</td></tr>`;
  }

  // Virtual Scroll
  datosNoAgregados = resultados.slice(maxPruebas);
  lastIndex += maxPruebas;

  document.getElementById("test-results").innerHTML += str;
};

const fillInputsData = (resultado, intentos) => {
  document.getElementById("result").value = resultado + "%";
  document.getElementById("tries").value = intentos;
};

const showContent = () => {
  document.getElementById("main").classList.remove("hidden");
};

// Scroll Listener
$container.addEventListener("scroll", () => {
  const { bottom: bottomCont } = $container.getBoundingClientRect();
  const { bottom: bottomTable } = $tableResult.getBoundingClientRect();

  if (scrollIsEnding(bottomTable, bottomCont) && datosNoAgregados.length > 0) {
    fillListadoPruebas(datosNoAgregados);
  }
});

// Saber si el escroll esta a punto de terminar.
const scrollIsEnding = (overflow, limit) => {
  return overflow - 250 <= limit;
};

const cleanLastSimulation = () => {
  // Vaciamos la Tabla de resultados
  document.getElementById("test-results").innerHTML.innerHTML = "";
  // Limpiamos los datos que no fueron agregados
  datosNoAgregados = [];
  // Limpiamos el ultimo index
  lastIndex = 0;
};
