/* =====================================================
   NOTES — SCRIPT
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

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


/* =====================================================
   EDITOR EXPANDIDO
===================================================== */

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


/* =====================================================
   ESTADO
===================================================== */

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

let sourceCard = null;


/* =====================================================
   INICIO
===================================================== */

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


/* =====================================================
   TEMA
===================================================== */

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


/* =====================================================
   SELECCIÓN DE TEMA
===================================================== */

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


/* =====================================================
   CREAR NOTA
===================================================== */

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


/* =====================================================
   MODAL
===================================================== */

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

    setTimeout(
        () => noteTitle.focus(),
        100
    );

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


/* =====================================================
   COLORES
===================================================== */

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


/* =====================================================
   GUARDAR NOTA DESDE MODAL
===================================================== */

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
                item =>
                    item.id ===
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

        notes.unshift({

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

        });

    }


    saveNotes();

    closeNoteModal();

    updateNotes();

}


/* =====================================================
   LOCAL STORAGE
===================================================== */

function saveNotes() {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

}


/* =====================================================
   ACTUALIZAR
===================================================== */

function updateNotes() {

    updateCounters();

    renderNotes();

}


/* =====================================================
   FILTRAR
===================================================== */

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


    visible.sort(
        (a, b) =>
            Number(b.pinned) -
            Number(a.pinned)
    );


    return visible;

}


/* =====================================================
   RENDERIZAR NOTAS
===================================================== */

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


            card.dataset.noteId =
                note.id;


            card.innerHTML = `

                <div class="note-card-header">

                    <h3>
                        ${escapeHTML(note.title)}
                    </h3>

                    <div class="note-actions">

                        <button
                            class="note-action"
                            data-action="favorite"
                            title="Favorita"
                        >
                            ${note.favorite
                                ? "★"
                                : "☆"}
                        </button>

                        <button
                            class="note-action"
                            data-action="pin"
                            title="Fijar"
                        >
                            ${note.pinned
                                ? "📌"
                                : "⌖"}
                        </button>

                        <button
                            class="note-action"
                            data-action="edit"
                            title="Editar"
                        >
                            ✎
                        </button>

                        <button
                            class="note-action"
                            data-action="trash"
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


            /* -----------------------------------------
               ABRIR NOTA
            ----------------------------------------- */

            card.addEventListener(
                "click",
                () => {

                    openExpandedNote(
                        note,
                        card
                    );

                }
            );


            /* -----------------------------------------
               ACCIONES
            ----------------------------------------- */

            card
                .querySelectorAll(
                    ".note-action"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            const action =
                                button.dataset.action;


                            if (
                                action ===
                                "favorite"
                            ) {

                                toggleFavorite(
                                    note.id
                                );

                            }


                            if (
                                action ===
                                "pin"
                            ) {

                                togglePinned(
                                    note.id
                                );

                            }


                            if (
                                action ===
                                "edit"
                            ) {

                                editNote(
                                    note.id
                                );

                            }


                            if (
                                action ===
                                "trash"
                            ) {

                                moveToTrash(
                                    note.id
                                );

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


/* =====================================================
   ⭐ FAVORITA
===================================================== */

function toggleFavorite(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );

    if (!note) return;

    note.favorite =
        !note.favorite;

    saveNotes();

    updateNotes();

}


/* =====================================================
   📌 FIJAR
===================================================== */

function togglePinned(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );

    if (!note) return;

    note.pinned =
        !note.pinned;

    saveNotes();

    updateNotes();

}


/* =====================================================
   PAPELERA
===================================================== */

function moveToTrash(id) {

    const note =
        notes.find(
            item =>
                item.id === id
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


/* =====================================================
   EDITAR DESDE BOTÓN
===================================================== */

function editNote(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );

    if (!note) return;

    openNoteModal(note);

}


/* =====================================================
   CONTADORES
===================================================== */

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


/* =====================================================
   BÚSQUEDA
===================================================== */

searchInput.addEventListener(
    "input",
    renderNotes
);


/* =====================================================
   NAVEGACIÓN
===================================================== */

document
    .querySelectorAll(
        ".nav-item"
    )
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


/* =====================================================
   🚀 ABRIR NOTA CON ANIMACIÓN APPLE
===================================================== */

function openExpandedNote(
    note,
    card
) {

    expandedNoteId =
        note.id;

    sourceCard =
        card;


    /* -----------------------------------------
       DATOS
    ----------------------------------------- */

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


    /* -----------------------------------------
       COLOR
    ----------------------------------------- */

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


    /* -----------------------------------------
       MOSTRAR OVERLAY
    ----------------------------------------- */

    expandedOverlay
        .classList
        .remove("hidden");


    /*
       Importante:
       esperamos un frame para que
       el navegador calcule la posición.
    */

    requestAnimationFrame(
        () => {

            animateCardToEditor();

        }
    );


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   ANIMACIÓN DESDE LA TARJETA
===================================================== */

function animateCardToEditor() {

    if (!sourceCard) {

        expandedOverlay
            .classList
            .add("active");

        return;

    }


    const cardRect =
        sourceCard.getBoundingClientRect();


    const editorRect =
        expandedNote.getBoundingClientRect();


    /*
       Calculamos cuánto tiene que
       desplazarse el editor para
       comenzar exactamente encima
       de la tarjeta.
    */

    const deltaX =
        cardRect.left -
        editorRect.left;


    const deltaY =
        cardRect.top -
        editorRect.top;


    const scaleX =
        cardRect.width /
        editorRect.width;


    const scaleY =
        cardRect.height /
        editorRect.height;


    /*
       Estado inicial.
    */

    expandedNote.style.transform =
        `
        translate(
            ${deltaX}px,
            ${deltaY}px
        )
        scale(
            ${scaleX},
            ${scaleY}
        )
        `;

    expandedNote.style.opacity =
        "1";


    /*
       Activamos overlay.
    */

    expandedOverlay
        .classList
        .add("active");


    /*
       Forzamos repaint.
    */

    expandedNote.offsetHeight;


    /*
       Animamos hasta pantalla completa.
    */

    requestAnimationFrame(
        () => {

            expandedNote.style.transform =
                "";

        }
    );


    /*
       Después de terminar,
       quitamos los estilos inline.
    */

    setTimeout(
        () => {

            expandedNote.style.transform =
                "";

        },
        500
    );


    /*
       Focus después de la expansión.
    */

    setTimeout(
        () => {

            expandedTitle.focus();

        },
        500
    );

}


/* =====================================================
   CERRAR NOTA
===================================================== */

function closeExpandedNote() {

    if (
        !sourceCard
    ) {

        finishClosing();

        return;

    }


    /*
       Volvemos a calcular las posiciones.
    */

    const cardRect =
        sourceCard.getBoundingClientRect();


    const editorRect =
        expandedNote.getBoundingClientRect();


    const deltaX =
        cardRect.left -
        editorRect.left;


    const deltaY =
        cardRect.top -
        editorRect.top;


    const scaleX =
        cardRect.width /
        editorRect.width;


    const scaleY =
        cardRect.height /
        editorRect.height;


    /*
       Cerramos hacia la tarjeta.
    */

    expandedNote.style.transform =
        `
        translate(
            ${deltaX}px,
            ${deltaY}px
        )
        scale(
            ${scaleX},
            ${scaleY}
        )
        `;


    expandedOverlay
        .classList
        .remove("active");


    setTimeout(
        () => {

            finishClosing();

        },
        450
    );

}


/* =====================================================
   FINALIZAR CIERRE
===================================================== */

function finishClosing() {

    expandedOverlay
        .classList
        .add("hidden");

    expandedNote.style.transform =
        "";

    expandedNote.style.opacity =
        "";

    sourceCard =
        null;

    expandedNoteId =
        null;

    document.body.style.overflow =
        "";

}


/* =====================================================
   CERRAR
===================================================== */

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


/* =====================================================
   GUARDAR EDITOR EXPANDIDO
===================================================== */

expandedSave.addEventListener(
    "click",
    saveExpandedNote
);


function saveExpandedNote() {

    const note =
        notes.find(
            item =>
                item.id ===
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


/* =====================================================
   FAVORITA DESDE EDITOR
===================================================== */

expandedFavorite.addEventListener(
    "click",
    () => {

        const note =
            notes.find(
                item =>
                    item.id ===
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


/* =====================================================
   FIJAR DESDE EDITOR
===================================================== */

expandedPin.addEventListener(
    "click",
    () => {

        const note =
            notes.find(
                item =>
                    item.id ===
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


/* =====================================================
   ATAJOS
===================================================== */

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


/* =====================================================
   FECHA
===================================================== */

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


/* =====================================================
   SEGURIDAD HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}