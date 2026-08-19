/* =========================================
   ELEMENTOS
========================================= */

const welcomeScreen =
    document.getElementById("welcome-screen");

const app =
    document.getElementById("app");

const lightThemeButton =
    document.getElementById("light-theme");

const darkThemeButton =
    document.getElementById("dark-theme");

const changeThemeButton =
    document.getElementById("change-theme");

const newNoteButton =
    document.getElementById("new-note-button");

const emptyButton =
    document.getElementById("empty-button");

const noteModal =
    document.getElementById("note-modal");

const closeModal =
    document.getElementById("close-modal");

const cancelNote =
    document.getElementById("cancel-note");

const saveNoteButton =
    document.getElementById("save-note");

const noteTitle =
    document.getElementById("note-title");

const noteContent =
    document.getElementById("note-content");

const noteTag =
    document.getElementById("note-tag");

const notesGrid =
    document.getElementById("notes-grid");

const emptyState =
    document.getElementById("empty-state");

const searchInput =
    document.getElementById("search-input");

const notesCount =
    document.getElementById("notes-count");

const favoritesCount =
    document.getElementById("favorites-count");

const pinnedCount =
    document.getElementById("pinned-count");

const trashCount =
    document.getElementById("trash-count");

const sectionTitle =
    document.getElementById("section-title");

const dateText =
    document.getElementById("date-text");


/* =========================================
   NOTA EXPANDIDA
========================================= */

const expandedOverlay =
    document.getElementById("expanded-overlay");

const expandedNote =
    document.getElementById("expanded-note");

const expandedTitle =
    document.getElementById("expanded-title");

const expandedContent =
    document.getElementById("expanded-content");

const expandedFavorite =
    document.getElementById("expanded-favorite");

const expandedPin =
    document.getElementById("expanded-pin");

const expandedClose =
    document.getElementById("expanded-close");

const expandedSave =
    document.getElementById("expanded-save");

const expandedDate =
    document.getElementById("expanded-date");

const expandedTag =
    document.getElementById("expanded-tag");


/* =========================================
   DATOS
========================================= */

let notes =
    JSON.parse(
        localStorage.getItem("notes")
    ) || [];

let editingNoteId = null;

let expandedNoteId = null;

let selectedColor =
    "lavender";

let currentSection =
    "all";


/* =========================================
   INICIO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const savedTheme =
            localStorage.getItem(
                "notes-theme"
            );


        if (savedTheme) {

            setTheme(savedTheme);

            showApp();

        }


        updateDate();

        updateNotes();

    }
);


/* =========================================
   TEMA
========================================= */

function setTheme(theme) {

    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );


    localStorage.setItem(
        "notes-theme",
        theme
    );

}


function showApp() {

    welcomeScreen
        .classList
        .add("hidden");

    app
        .classList
        .remove("hidden");

}


/* =========================================
   SELECCIÓN DE TEMA
========================================= */

lightThemeButton.addEventListener(
    "click",
    () => {

        setTheme("light");

        showApp();

    }
);


darkThemeButton.addEventListener(
    "click",
    () => {

        setTheme("dark");

        showApp();

    }
);


changeThemeButton.addEventListener(
    "click",
    () => {

        const currentTheme =
            document.documentElement
                .getAttribute(
                    "data-theme"
                );


        setTheme(
            currentTheme === "dark"
                ? "light"
                : "dark"
        );

    }
);


/* =========================================
   NUEVA NOTA
========================================= */

newNoteButton.addEventListener(
    "click",
    () => {

        openNoteModal();

    }
);


emptyButton.addEventListener(
    "click",
    () => {

        openNoteModal();

    }
);


/* =========================================
   MODAL NUEVA NOTA
========================================= */

function openNoteModal(note = null) {

    noteModal
        .classList
        .remove("hidden");


    if (note) {

        editingNoteId =
            note.id;


        document.getElementById(
            "modal-title"
        ).textContent =
            "Editar nota";


        noteTitle.value =
            note.title;


        noteContent.value =
            note.content;


        noteTag.value =
            note.tag || "";


        selectedColor =
            note.color || "lavender";

    } else {

        editingNoteId =
            null;


        document.getElementById(
            "modal-title"
        ).textContent =
            "Nueva nota";


        noteTitle.value =
            "";


        noteContent.value =
            "";


        noteTag.value =
            "";


        selectedColor =
            "lavender";

    }


    updateColorSelection();

    noteTitle.focus();

}


function closeNoteModal() {

    noteModal
        .classList
        .add("hidden");

    editingNoteId =
        null;

}


closeModal.addEventListener(
    "click",
    closeNoteModal
);


cancelNote.addEventListener(
    "click",
    closeNoteModal
);


noteModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            noteModal
        ) {

            closeNoteModal();

        }

    }
);


/* =========================================
   COLORES
========================================= */

document
    .querySelectorAll(
        ".color-option"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectedColor =
                    button.dataset.color;

                updateColorSelection();

            }
        );

    });


function updateColorSelection() {

    document
        .querySelectorAll(
            ".color-option"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.color ===
                selectedColor
            );

        });

}


/* =========================================
   GUARDAR NOTA
========================================= */

saveNoteButton.addEventListener(
    "click",
    saveNote
);


function saveNote() {

    const title =
        noteTitle.value.trim();

    const content =
        noteContent.value.trim();


    if (!title && !content) {

        noteTitle.focus();

        return;

    }


    if (editingNoteId) {

        const note =
            notes.find(
                note =>
                    note.id ===
                    editingNoteId
            );


        if (note) {

            note.title =
                title || "Sin título";

            note.content =
                content;

            note.tag =
                noteTag.value;

            note.color =
                selectedColor;

            note.updatedAt =
                new Date().toISOString();

        }

    } else {

        const newNote = {

            id:
                Date.now(),

            title:
                title || "Sin título",

            content:
                content,

            tag:
                noteTag.value,

            color:
                selectedColor,

            favorite:
                false,

            pinned:
                false,

            trash:
                false,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        };


        notes.unshift(
            newNote
        );

    }


    saveNotes();

    closeNoteModal();

    updateNotes();

}


/* =========================================
   LOCAL STORAGE
========================================= */

function saveNotes() {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

}


/* =========================================
   ACTUALIZAR NOTAS
========================================= */

function updateNotes() {

    updateCounters();

    renderNotes();

}


/* =========================================
   FILTRAR
========================================= */

function getVisibleNotes() {

    let visible =
        [...notes];


    if (
        currentSection ===
        "favorites"
    ) {

        visible =
            visible.filter(
                note =>
                    note.favorite &&
                    !note.trash
            );

    }


    if (
        currentSection ===
        "pinned"
    ) {

        visible =
            visible.filter(
                note =>
                    note.pinned &&
                    !note.trash
            );

    }


    if (
        currentSection ===
        "trash"
    ) {

        visible =
            visible.filter(
                note =>
                    note.trash
            );

    }


    if (
        currentSection ===
        "all"
    ) {

        visible =
            visible.filter(
                note =>
                    !note.trash
            );

    }


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    if (search) {

        visible =
            visible.filter(note =>

                note.title
                    .toLowerCase()
                    .includes(search)

                ||

                note.content
                    .toLowerCase()
                    .includes(search)

            );

    }


    /*
        Las fijadas aparecen primero
    */

    visible.sort(
        (a, b) =>
            Number(b.pinned) -
            Number(a.pinned)
    );


    return visible;

}


/* =========================================
   RENDERIZAR
========================================= */

function renderNotes() {

    const visibleNotes =
        getVisibleNotes();


    notesGrid.innerHTML =
        "";


    if (
        visibleNotes.length === 0
    ) {

        notesGrid.style.display =
            "none";

        emptyState.style.display =
            "block";

        return;

    }


    notesGrid.style.display =
        "grid";

    emptyState.style.display =
        "none";


    visibleNotes.forEach(
        note => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                `note-card ${note.color}`;


            card.innerHTML = `

                <div class="note-card-header">

                    <h3>
                        ${escapeHTML(note.title)}
                    </h3>

                    <div class="note-actions">

                        <button
                            class="note-action"
                            data-action="favorite"
                            data-id="${note.id}"
                            title="Favorita"
                        >
                            ${note.favorite
                                ? "★"
                                : "☆"}
                        </button>


                        <button
                            class="note-action"
                            data-action="pin"
                            data-id="${note.id}"
                            title="Fijar"
                        >
                            ${note.pinned
                                ? "📌"
                                : "⌖"}
                        </button>


                        <button
                            class="note-action"
                            data-action="edit"
                            data-id="${note.id}"
                            title="Editar"
                        >
                            ✎
                        </button>


                        <button
                            class="note-action"
                            data-action="trash"
                            data-id="${note.id}"
                            title="Eliminar"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <p class="note-content">
                    ${escapeHTML(note.content)}
                </p>


                <div class="note-footer">

                    <span>
                        ${formatDate(note.updatedAt)}
                    </span>

                    ${
                        note.tag
                        ?
                        `
                        <span class="note-tag-label">
                            ${escapeHTML(note.tag)}
                        </span>
                        `
                        :
                        ""
                    }

                </div>

            `;


            /*
                Abrir nota
            */

            card.addEventListener(
                "click",
                () => {

                    openExpandedNote(note);

                }
            );


            /*
                Botones
            */

            card
                .querySelectorAll(
                    ".note-action"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();


                            const id =
                                Number(
                                    button
                                        .dataset
                                        .id
                                );


                            const action =
                                button
                                    .dataset
                                    .action;


                            if (
                                action ===
                                "favorite"
                            ) {

                                toggleFavorite(id);

                            }


                            if (
                                action ===
                                "pin"
                            ) {

                                togglePinned(id);

                            }


                            if (
                                action ===
                                "edit"
                            ) {

                                editNote(id);

                            }


                            if (
                                action ===
                                "trash"
                            ) {

                                moveToTrash(id);

                            }

                        }
                    );

                });


            notesGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================
   EDITAR
========================================= */

function editNote(id) {

    const note =
        notes.find(
            note =>
                note.id === id
        );


    if (!note) return;


    openNoteModal(note);

}


/* =========================================
   FAVORITA
========================================= */

function toggleFavorite(id) {

    const note =
        notes.find(
            note =>
                note.id === id
        );


    if (!note) return;


    note.favorite =
        !note.favorite;


    saveNotes();

    updateNotes();

}


/* =========================================
   FIJAR
========================================= */

function togglePinned(id) {

    const note =
        notes.find(
            note =>
                note.id === id
        );


    if (!note) return;


    note.pinned =
        !note.pinned;


    saveNotes();

    updateNotes();

}


/* =========================================
   PAPELERA
========================================= */

function moveToTrash(id) {

    const note =
        notes.find(
            note =>
                note.id === id
        );


    if (!note) return;


    note.trash =
        true;

    note.favorite =
        false;

    note.pinned =
        false;


    saveNotes();

    updateNotes();

}


/* =========================================
   CONTADORES
========================================= */

function updateCounters() {

    const normal =
        notes.filter(
            note =>
                !note.trash
        );


    const favorites =
        normal.filter(
            note =>
                note.favorite
        );


    const pinned =
        normal.filter(
            note =>
                note.pinned
        );


    const trash =
        notes.filter(
            note =>
                note.trash
        );


    notesCount.textContent =
        normal.length;

    favoritesCount.textContent =
        favorites.length;

    pinnedCount.textContent =
        pinned.length;

    trashCount.textContent =
        trash.length;

}


/* =========================================
   BUSCAR
========================================= */

searchInput.addEventListener(
    "input",
    renderNotes
);


/* =========================================
   NAVEGACIÓN
========================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach(item =>
                        item.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                currentSection =
                    button.dataset.section;


                const titles = {

                    all:
                        "Mis notas",

                    favorites:
                        "Favoritas",

                    pinned:
                        "Notas fijadas",

                    trash:
                        "Papelera"

                };


                sectionTitle.textContent =
                    titles[
                        currentSection
                    ];


                renderNotes();

            }
        );

    });


/* =========================================
   NOTA EXPANDIDA
========================================= */

function openExpandedNote(note) {

    expandedNoteId =
        note.id;


    expandedTitle.value =
        note.title;


    expandedContent.value =
        note.content;


    expandedDate.textContent =
        `Editada ${formatDate(
            note.updatedAt
        )}`;


    expandedTag.textContent =
        note.tag ||
        "Sin etiqueta";


    expandedFavorite.textContent =
        note.favorite
            ? "★"
            : "☆";


    expandedPin.textContent =
        note.pinned
            ? "📌"
            : "⌖";


    /*
        Color
    */

    expandedNote.classList.remove(
        "lavender",
        "blue",
        "sage",
        "beige",
        "rose"
    );


    expandedNote.classList.add(
        note.color
    );


    expandedOverlay
        .classList
        .remove(
            "hidden"
        );


    requestAnimationFrame(
        () => {

            expandedOverlay
                .classList
                .add(
                    "active"
                );

        }
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        () => {

            expandedTitle.focus();

        },
        400
    );

}


/* =========================================
   CERRAR EXPANDIDA
========================================= */

function closeExpandedNote() {

    expandedOverlay
        .classList
        .remove(
            "active"
        );


    setTimeout(
        () => {

            expandedOverlay
                .classList
                .add(
                    "hidden"
                );


            document.body.style.overflow =
                "";

        },
        400
    );

}


expandedClose.addEventListener(
    "click",
    closeExpandedNote
);


expandedOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            expandedOverlay
        ) {

            closeExpandedNote();

        }

    }
);


/* =========================================
   GUARDAR EXPANDIDA
========================================= */

expandedSave.addEventListener(
    "click",
    () => {

        const note =
            notes.find(
                note =>
                    note.id ===
                    expandedNoteId
            );


        if (!note) return;


        note.title =
            expandedTitle.value.trim()
            ||
            "Sin título";


        note.content =
            expandedContent.value.trim();


        note.updatedAt =
            new Date().toISOString();


        saveNotes();

        updateNotes();

        closeExpandedNote();

    }
);


/* =========================================
   FAVORITA EXPANDIDA
========================================= */

expandedFavorite.addEventListener(
    "click",
    () => {

        const note =
            notes.find(
                note =>
                    note.id ===
                    expandedNoteId
            );


        if (!note) return;


        note.favorite =
            !note.favorite;


        expandedFavorite.textContent =
            note.favorite
                ? "★"
                : "☆";


        saveNotes();

        updateCounters();

    }
);


/* =========================================
   FIJAR EXPANDIDA
========================================= */

expandedPin.addEventListener(
    "click",
    () => {

        const note =
            notes.find(
                note =>
                    note.id ===
                    expandedNoteId
            );


        if (!note) return;


        note.pinned =
            !note.pinned;


        expandedPin.textContent =
            note.pinned
                ? "📌"
                : "⌖";


        saveNotes();

        updateCounters();

    }
);


/* =========================================
   TECLADO
========================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
            Ctrl + K
        */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() ===
            "k"
        ) {

            event.preventDefault();

            searchInput.focus();

        }


        /*
            Escape
        */

        if (
            event.key ===
            "Escape"
        ) {

            if (
                expandedOverlay
                    .classList
                    .contains(
                        "active"
                    )
            ) {

                closeExpandedNote();

            }

            else if (
                !noteModal
                    .classList
                    .contains(
                        "hidden"
                    )
            ) {

                closeNoteModal();

            }

        }

    }
);


/* =========================================
   FECHA
========================================= */

function updateDate() {

    const now =
        new Date();


    const options = {

        weekday:
            "long",

        day:
            "numeric",

        month:
            "long"

    };


    const date =
        now.toLocaleDateString(
            "es-ES",
            options
        );


    dateText.textContent =
        date.charAt(0).toUpperCase()
        +
        date.slice(1);

}


function formatDate(date) {

    const d =
        new Date(date);


    return d.toLocaleDateString(
        "es-ES",
        {
            day:
                "numeric",

            month:
                "short"
        }
    );

}


/* =========================================
   SEGURIDAD
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}