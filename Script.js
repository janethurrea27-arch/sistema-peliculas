// SISTEMA DE GESTIÓN DE PELÍCULAS

// Array principal
let peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];

// REFERENCIAS DEL DOM

const formulario = document.getElementById("formularioPeliculas");

const titulo = document.getElementById("titulo");

const director = document.getElementById("director");

const anio = document.getElementById("anio");

const categoria = document.getElementById("categoria");

const tablaPeliculas = document.getElementById("tablaPeliculas");

const buscador = document.getElementById("buscador");

const filtroCategoria = document.getElementById("filtroCategoria");

const indiceEditar = document.getElementById("indiceEditar");

const botonGuardar = document.getElementById("botonGuardar");

// EVENTOS

formulario.addEventListener("submit", guardarPelicula);

buscador.addEventListener("input", mostrarPeliculas);

filtroCategoria.addEventListener("change", mostrarPeliculas);

// Mostrar películas al cargar
mostrarPeliculas();

// GUARDAR PELÍCULA

function guardarPelicula(evento) {

    evento.preventDefault();

    const nuevaPelicula = {
        titulo: titulo.value.trim(),
        director: director.value.trim(),
        anio: parseInt(anio.value),
        categoria: categoria.value
    };


    // VALIDACIONES

    if (nuevaPelicula.titulo.length < 2) {

        alert("El título debe tener mínimo 2 caracteres");

        return;
    }

    if (nuevaPelicula.director.length < 3) {

        alert("El director debe tener mínimo 3 caracteres");

        return;
    }

    if (
        nuevaPelicula.anio < 1900 ||
        nuevaPelicula.anio > 2026 ||
        isNaN(nuevaPelicula.anio)
    ) {

        alert("El año debe estar entre 1900 y 2026");

        return;
    }

    if (nuevaPelicula.categoria === "") {

        alert("Debe seleccionar una categoría");

        return;
    }

    // EDITAR O CREAR


    if (indiceEditar.value !== "") {

        peliculas[indiceEditar.value] = nuevaPelicula;

        indiceEditar.value = "";

        botonGuardar.textContent = "Guardar Película";

    } else {

        peliculas.push(nuevaPelicula);
    }

    guardarLocalStorage();

    mostrarPeliculas();

    formulario.reset();
}

// MOSTRAR PELÍCULAS

function mostrarPeliculas() {

    tablaPeliculas.innerHTML = "";

    const textoBusqueda = buscador.value.toLowerCase();

    const categoriaSeleccionada = filtroCategoria.value;

    const peliculasFiltradas = peliculas.filter(pelicula => {

        const coincideTitulo = pelicula.titulo
            .toLowerCase()
            .includes(textoBusqueda);

        const coincideCategoria =
            categoriaSeleccionada === "Todas" ||
            pelicula.categoria === categoriaSeleccionada;

        return coincideTitulo && coincideCategoria;
    });

    peliculasFiltradas.forEach((pelicula, indice) => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${pelicula.titulo}</td>

            <td>${pelicula.director}</td>

            <td>${pelicula.anio}</td>

            <td>${pelicula.categoria}</td>

            <td>
                <button
                    class="boton-editar"
                    onclick="editarPelicula(${indice})"
                >
                    Editar
                </button>

                <button
                    class="boton-eliminar"
                    onclick="eliminarPelicula(${indice})"
                >
                    Eliminar
                </button>
            </td>
        `;

        tablaPeliculas.appendChild(fila);
    });
}

// EDITAR PELÍCULA

function editarPelicula(indice) {

    const pelicula = peliculas[indice];

    titulo.value = pelicula.titulo;

    director.value = pelicula.director;

    anio.value = pelicula.anio;

    categoria.value = pelicula.categoria;

    indiceEditar.value = indice;

    botonGuardar.textContent = "Actualizar Película";
}

// ELIMINAR PELÍCULA

function eliminarPelicula(indice) {

    const confirmar = confirm(
        "¿Desea eliminar esta película?"
    );

    if (confirmar) {

        peliculas.splice(indice, 1);

        guardarLocalStorage();

        mostrarPeliculas();
    }
}

// LOCAL STORAGE

function guardarLocalStorage() {

    localStorage.setItem(
        "peliculas",
        JSON.stringify(peliculas)
    );
}