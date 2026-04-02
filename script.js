let becas = []; // Aquí se guardarán las becas cargadas

// Función para mostrar becas en la página
function mostrarBecas(lista) {
  const contenedor = document.getElementById("becasList");
  contenedor.innerHTML = "";
  lista.forEach(beca => {
    const card = document.createElement("div");
    card.className = "beca-card";
    card.innerHTML = `
      <h3>${beca.titulo}</h3>
      <div class="tags">
        <span class="tag ${beca.nivel}">${beca.nivel}</span>
        <span class="tag ${beca.tipo}">${beca.tipo}</span>
      </div>
      <p>${beca.descripcion}</p>
      <p><strong>Cierre:</strong> ${beca.fechaCierre}</p>
      <a href="${beca.enlace}" target="_blank"><button>Aplicar Aquí</button></a>
      <button class="fav-btn" data-titulo="${beca.titulo}">⭐ Favorito</button>
    `;
    contenedor.appendChild(card);
  });
  activarFavoritos();
}

// Función para filtrar becas
function filtrarBecas() {
  const tipo = document.getElementById("tipoFilter").value;
  const area = document.getElementById("areaFilter").value;
  const nivel = document.getElementById("nivelFilter").value;
  const fecha = document.getElementById("fechaFilter").value;
  const search = document.getElementById("searchInput").value.toLowerCase();
  const orden = document.getElementById("ordenFilter").value;

  let filtradas = becas.filter(beca => {
    return (!tipo || beca.tipo === tipo) &&
           (!area || beca.area === area) &&
           (!nivel || beca.nivel === nivel) &&
           (!fecha || beca.fechaCierre >= fecha) &&
           (!search || beca.titulo.toLowerCase().includes(search) || beca.descripcion.toLowerCase().includes(search));
  });

  // Ordenar por fecha de cierre
  if (orden) {
    filtradas.sort((a, b) => {
      const fechaA = new Date(a.fechaCierre);
      const fechaB = new Date(b.fechaCierre);
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
      let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
      
      if (!favoritos.includes(titulo)) {
        favoritos.push(titulo);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        alert(`Se agregó "${titulo}" a favoritos`);
      } else {
        alert(`"${titulo}" ya está en favoritos`);
      }
    });
  });
}

// Mostrar favoritos
function mostrarFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const lista = document.getElementById("favoritosList");
  lista.innerHTML = "";

  favoritos.forEach(beca => {
    const card = document.createElement("div");
    card.className = "beca-card favorito-card";
    card.innerHTML = `
      <h3>${beca.titulo}</h3>
      <div class="tags">
        <span class="tag ${beca.nivel}">${beca.nivel}</span>
        <span class="tag ${beca.tipo}">${beca.tipo}</span>
      </div>
      <p>${beca.descripcion}</p>
      <p><strong>Cierre:</strong> ${beca.fechaCierre}</p>
      <a href="${beca.enlace}" target="_blank"><button>Aplicar Aquí</button></a>
      <button class="remove-btn">❌ Eliminar</button>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
      eliminarFavorito(beca.titulo);
    });

    lista.appendChild(card);
  });
}

function eliminarFavorito(titulo) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos = favoritos.filter(item => item !== titulo);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  mostrarFavoritos(); // refresca la lista
}