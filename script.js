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
    `;
    contenedor.appendChild(card);
  });
}

// Función para filtrar becas
function filtrarBecas() {
  const tipo = document.getElementById("tipoFilter").value;
  const area = document.getElementById("areaFilter").value;
  const nivel = document.getElementById("nivelFilter").value;
  const fecha = document.getElementById("fechaFilter").value;
  const search = document.getElementById("searchInput").value.toLowerCase();

  const filtradas = becas.filter(beca => {
    return (!tipo || beca.tipo === tipo) &&
           (!area || beca.area === area) &&
           (!nivel || beca.nivel === nivel) &&
           (!fecha || beca.fechaCierre >= fecha) &&
           (!search || beca.titulo.toLowerCase().includes(search) || beca.descripcion.toLowerCase().includes(search));
  });
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
// Buscador dinámico
document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const cards = document.querySelectorAll(".beca-card");

    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        if (text.includes(query)) {
            card.style.display = "block";  // mostrar si coincide
        } else {
            card.style.display = "none";   // ocultar si no coincide
        }
    });
});