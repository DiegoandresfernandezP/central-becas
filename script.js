let becas = []; // Aquí se guardarán las becas cargadas
let paginaActual = 1;
let becasPorPagina = 12; // puedes cambiar a 20, 50, etc.

// Función para mostrar becas en la página
function mostrarBecas(lista) {
  const contenedor = document.getElementById("becasList");
  contenedor.innerHTML = "";

  // Calcular inicio y fin según la página actual
  const inicio = (paginaActual - 1) * becasPorPagina;
  const fin = inicio + becasPorPagina;
  const becasPagina = lista.slice(inicio, fin);

  becasPagina.forEach(beca => {
    const card = document.createElement("div");
    card.className = "beca-card";
    card.innerHTML = `
      <h3>${beca.titulo}</h3>
      <div class="tags">
        <span class="tag">${beca.tipo}</span>
        <span class="tag">${beca.area}</span>
        <span class="tag">${beca.fase}</span>
        <span class="tag">${beca.pais}</span>
      </div>
      <p>${beca.descripcion}</p>
      <p><strong>Cierre:</strong> ${beca.fechaCierre}</p>
      <a href="${beca.enlace}" target="_blank"><button>Aplicar Aquí</button></a>
      <button class="fav-btn" data-titulo="${beca.titulo}">⭐ Favorito</button>
    `;
    contenedor.appendChild(card);
  });

  activarFavoritos();
  mostrarControles(lista.length);
}
// Función para filtrar becas
function filtrarBecas() {
  const tipo = document.getElementById("tipoFilter").value;
  const area = document.getElementById("areaFilter").value;
  const fase = document.getElementById("faseFilter").value;
  const pais = document.getElementById("paisFilter").value;
  const search = document.getElementById("searchInput").value.toLowerCase();
  const orden = document.getElementById("ordenFilter").value;

  let filtradas = becas.filter(beca => {
    return (!tipo || beca.tipo === tipo) &&
           (!area || beca.area === area) &&
           (!fase || beca.fase === fase) &&
           (!pais || beca.pais === pais) &&
           (!search || beca.titulo.toLowerCase().includes(search) || beca.descripcion.toLowerCase().includes(search));
  });

  // Ordenar por fecha de cierre (solo si es fecha válida)
  if (orden) {
    filtradas.sort((a, b) => {
      const fechaA = new Date(a.fechaCierre);
      const fechaB = new Date(b.fechaCierre);
      if (isNaN(fechaA) || isNaN(fechaB)) return 0; // ignora si no es fecha
      return orden === "asc" ? fechaA - fechaB : fechaB - fechaA;
    });
  }

  mostrarBecas(filtradas);
}

// Cargar becas desde JSON
fetch("becas.json")
  .then(res => res.json())
  .then(data => {
    becas = data;
    mostrarBecas(becas);
  });

// Activar buscador en tiempo real
document.getElementById("searchInput").addEventListener("input", filtrarBecas);
document.getElementById("ordenFilter").addEventListener("change", filtrarBecas);

// Guardar favoritos
function activarFavoritos() {
  const botones = document.querySelectorAll(".fav-btn");
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const titulo = btn.getAttribute("data-titulo");
      const beca = becas.find(b => b.titulo === titulo); // objeto completo
      let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
      
      // Verificar si ya existe por título
      if (!favoritos.some(f => f.titulo === titulo)) {
        favoritos.push(beca);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        alert(`Se agregó "${titulo}" a favoritos`);
      } else {
        alert(`"${titulo}" ya está en favoritos`);
      }
    });
  });
}

function diasRestantes(fechaCierre) {
  const hoy = new Date();
  const cierre = new Date(fechaCierre);
  if (isNaN(cierre)) return 0; // si no es fecha válida
  const diferencia = cierre - hoy;
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  return dias > 0 ? dias : 0; // si ya pasó, mostrar 0
}

// Mostrar favoritos
function mostrarFavoritos() {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const lista = document.getElementById("favoritosList");
  lista.innerHTML = "";

  // Ordenar por fecha de cierre (más próxima primero)
  favoritos.sort((a, b) => diasRestantes(a.fechaCierre) - diasRestantes(b.fechaCierre));

  favoritos.forEach(beca => {
    const dias = diasRestantes(beca.fechaCierre);

    // Determinar color según urgencia
    let colorClase = "verde";
    if (dias <= 7) {
      colorClase = "rojo";
    } else if (dias <= 30) {
      colorClase = "naranja";
    }

    const card = document.createElement("div");
    card.className = "beca-card favorito-card";
    card.innerHTML = `
      <h3>${beca.titulo}</h3>
      <div class="tags">
        <span class="tag">${beca.tipo}</span>
        <span class="tag">${beca.area}</span>
        <span class="tag">${beca.fase}</span>
        <span class="tag">${beca.pais}</span>
      </div>
      <p>${beca.descripcion}</p>
      <p><strong>Cierre:</strong> ${beca.fechaCierre}</p>
      <p class="dias-restantes ${colorClase}"><strong>Días restantes:</strong> ${dias}</p>
      <a href="${beca.enlace}" target="_blank"><button>Aplicar Aquí</button></a>
      <button class="remove-btn">❌ Eliminar</button>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
      eliminarFavorito(beca.titulo);
    });

    lista.appendChild(card);
  });
}

// Eliminar favoritos
function eliminarFavorito(titulo) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const nuevosFavoritos = favoritos.filter(beca => beca.titulo !== titulo);
  localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
  mostrarFavoritos(); // refresca la lista
}

// Mostrar favoritos filtrados
function mostrarFavoritosFiltrados(lista) {
  const contenedor = document.getElementById("favoritosList");
  contenedor.innerHTML = "";

  lista.sort((a, b) => diasRestantes(a.fechaCierre) - diasRestantes(b.fechaCierre));

  lista.forEach(beca => {
    const dias = diasRestantes(beca.fechaCierre);
    let colorClase = "verde";
    if (dias <= 7) colorClase = "rojo";
    else if (dias <= 30) colorClase = "naranja";

    const card = document.createElement("div");
    card.className = "beca-card favorito-card";
    card.innerHTML = `
      <h3>${beca.titulo}</h3>
      <div class="tags">
        <span class="tag">${beca.tipo}</span>
        <span class="tag">${beca.area}</span>
        <span class="tag">${beca.fase}</span>
        <span class="tag">${beca.pais}</span>
      </div>
      <p>${beca.descripcion}</p>
      <p><strong>Cierre:</strong> ${beca.fechaCierre}</p>
      <p class="dias-restantes ${colorClase}"><strong>Días restantes:</strong> ${dias}</p>
      <a href="${beca.enlace}" target="_blank"><button>Aplicar Aquí</button></a>
      <button class="remove-btn">❌ Eliminar</button>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
      eliminarFavorito(beca.titulo);
    });

    contenedor.appendChild(card);
  });
}
function mostrarControles(totalBecas) {
  const controles = document.getElementById("paginacion");
  controles.innerHTML = "";

  const totalPaginas = Math.ceil(totalBecas / becasPorPagina);

  if (paginaActual > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "⬅️ Anterior";
    prevBtn.onclick = () => {
      paginaActual--;
      filtrarBecas();
    };
    controles.appendChild(prevBtn);
  }

  if (paginaActual < totalPaginas) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente ➡️";
    nextBtn.onclick = () => {
      paginaActual++;
      filtrarBecas();
    };
    controles.appendChild(nextBtn);
  }

  // Selector de cantidad por página
  const selector = document.createElement("select");
  [12, 24, 50, 100].forEach(num => {
    const option = document.createElement("option");
    option.value = num;
    option.textContent = `${num} por página`;
    if (num === becasPorPagina) option.selected = true;
    selector.appendChild(option);
  });
  selector.onchange = () => {
    becasPorPagina = parseInt(selector.value);
    paginaActual = 1;
    filtrarBecas();
  };
  controles.appendChild(selector);
}