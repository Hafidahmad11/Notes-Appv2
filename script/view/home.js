const STORAGE_KEY = "NOTES_APP_PIID";


function isStorageExist() {
  return typeof Storage !== "undefined";
}

function saveData() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadDataFromStorage(key) {
  const storedData = localStorage.getItem(key);

  if (!storedData) {
    return null;
  }

  try {
    const parsedData = JSON.parse(storedData);
    return parsedData;
  } catch (error) {
    console.error("Error parsing data from localStorage:", error);
    return null;
  }
}

function createNoteId() {
  return +new Date();
}

function loadNotes() {
  const storedNotes = loadDataFromStorage("notes");

  if (storedNotes) {
    notes = storedNotes; 
    renderNotes(); 
    renderArchivedNotes(); 
  }
}

function searchNotes(query) {
  const searchTerm = query.trim().toLowerCase();

  if (searchTerm === "") {
    // Jika pencarian kosong, render semua catatan
    renderNotes();
    renderArchivedNotes();
    return;
  }

  const filteredActiveNotes = notes.filter(
    (note) =>
      !note.archived &&
      (note.title.toLowerCase().includes(searchTerm) ||
        note.body.toLowerCase().includes(searchTerm))
  );

  const filteredArchivedNotes = notes.filter(
    (note) =>
      note.archived &&
      (note.title.toLowerCase().includes(searchTerm) ||
        note.body.toLowerCase().includes(searchTerm))
  );

  if (filteredActiveNotes.length === 0) {
    const notesList = document.getElementById("notesList");
    notesList.innerHTML = "<p class='no-result-message'>Tidak ada catatan yang sesuai dengan pencarian.</p>";
  } else {
    renderNotes(filteredActiveNotes);
  }

  if (filteredArchivedNotes.length > 0) {
    renderArchivedNotes(filteredArchivedNotes);
  } else {
    const archivedNotesList = document.getElementById("archivedNotesList");
    archivedNotesList.innerHTML = "<p class='no-result-message'>Tidak ada catatan yang sesuai dengan pencarian.</p>";
  }
}




function addNote() {
  const title = document.getElementById("title").value;
  const body = document.getElementById("description").value;

  if (!validateTitle(title) || !validateDescription(body)) {
    return;
  }

  const createdAt = new Date().toISOString();
  const note = { id: createNoteId(), title, body, createdAt, archived: false };
  notes.push(note);
  saveData();
  renderNotes(notes);
  clearForm();
  showToast("Catatan berhasil ditambahkan!");

  const modalBg = document.getElementById("modalBg");
  modalBg.style.display = "none";
}

function editNoteById(noteId) {
  const confirmation = confirm("Apakah Anda ingin mengedit catatan ini?");

  if (confirmation) {
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    const editedTitle = prompt("Edit judul catatan:", notes[noteIndex].title);
    const editedBody = prompt("Edit deskripsi catatan:", notes[noteIndex].body);

    if (editedTitle !== null && editedBody !== null) {
      notes[noteIndex].title = editedTitle;
      notes[noteIndex].body = editedBody;

      saveData();
      renderNotes();
      renderArchivedNotes();
      showToast("Catatan berhasil diedit!");
    }
  }
}

function deleteNoteById(noteId) {
  const confirmation = confirm(
    "Apakah Anda yakin ingin menghapus catatan ini?"
  );

  if (confirmation) {
    notes = notes.filter((note) => note.id !== noteId);
    saveData();
    renderNotes();
    renderArchivedNotes();
    showToast("Catatan berhasil dihapus!");
  }
}

function archiveNoteById(noteId) {
  const noteIndex = notes.findIndex((note) => note.id === noteId);
  if (noteIndex !== -1) {
    const confirmation = confirm("Apakah Anda yakin ingin mengarsipkan catatan ini?");
    if (confirmation) {
      notes[noteIndex].archived = true;
      saveData();
      renderNotes(); 
      renderArchivedNotes(); 
      showToast("Catatan berhasil diarsipkan!");
    }
  }
}

function unarchiveNoteById(noteId) {
  const noteIndex = notes.findIndex((note) => note.id === noteId);
  if (noteIndex !== -1) {
    notes[noteIndex].archived = false;
    saveData();
    renderNotes();
    renderArchivedNotes();
    showToast("Catatan berhasil di-unarchive!");
  }
}

function saveEditedNote(noteId, editedTitle, editedDescription) {
  const noteIndex = notes.findIndex((note) => note.id === noteId);
  notes[noteIndex].title = editedTitle;
  notes[noteIndex].body = editedDescription;
  saveData();
  renderNotes();
  showToast("Catatan berhasil diedit!");
}

function renderNotes(filteredNotes = []) {
  const notesToRender = filteredNotes.length > 0 ? filteredNotes : notes.filter((note) => !note.archived);
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";
  notesToRender.forEach((note) => {
    const noteCard = makeNoteCard(note);
    notesList.appendChild(noteCard);
  });
}

function renderArchivedNotes() {
  const archivedNotes = notes.filter((note) => note.archived);
  const archivedNotesList = document.getElementById("archivedNotesList");
  archivedNotesList.innerHTML = "";
  archivedNotes.forEach((note) => {
    const archivedNoteCard = makeNoteCard(note);
    archivedNotesList.appendChild(archivedNoteCard);
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(function () {
    document.body.removeChild(toast);
  }, 3000);
}

function openModal(note) {
  const modalBgNote = document.getElementById("modalBgNote");
  const modalBgTitle = document.getElementById("modalBgTitle");
  const modalBgBody = document.getElementById("modalBgBody");

  modalBgTitle.textContent = note.title;
  modalBgBody.textContent = note.body;

  modalBgNote.style.display = "block";
}

function validateTitle(title) {
  const titleInput = document.getElementById("title");
  const titleErrorMessage = document.getElementById("titleErrorMessage");

  if (!title.trim()) {
    titleErrorMessage.textContent = "Judul harus diisi!";
    titleInput.classList.add("error");
    return false;
  } else {
    titleErrorMessage.textContent = "";
    titleInput.classList.remove("error");
    return true;
  }
}

function validateDescription(description) {
  const descriptionInput = document.getElementById("description");
  const descriptionErrorMessage = document.getElementById(
    "descriptionErrorMessage"
  );

  if (!description.trim()) {
    descriptionErrorMessage.textContent = "Deskripsi harus diisi!";
    descriptionInput.classList.add("error");
    return false;
  } else {
    descriptionErrorMessage.textContent = "";
    descriptionInput.classList.remove("error");
    return true;
  }
}

function clearFormValidation() {
  const titleInput = document.getElementById("title");
  const titleErrorMessage = document.getElementById("titleErrorMessage");
  const descriptionInput = document.getElementById("description");
  const descriptionErrorMessage = document.getElementById("descriptionErrorMessage");

  titleErrorMessage.textContent = "";
  descriptionErrorMessage.textContent = "";

  titleInput.classList.remove("error");
  descriptionInput.classList.remove("error");
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
}

function makeNoteCard(note) {
  const noteCard = document.createElement("div");
  noteCard.classList.add("note");
  noteCard.dataset.id = note.id;

  const title = document.createElement("h3");
  title.innerText = note.title;

  const body = document.createElement("p");
  body.innerText = note.body;

  noteCard.addEventListener("click", function () {
    openModal(note);
  });

  const separator = document.createElement("hr");

  const createdAt = document.createElement("p");
  const createdAtDate = new Date(note.createdAt);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  createdAt.innerText = `${createdAtDate.toLocaleDateString("en-US", options)}`;

  const actionButtons = document.createElement("div");
  actionButtons.classList.add("action-buttons");

  const ellipsisButton = document.createElement("button");
  ellipsisButton.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
  ellipsisButton.classList.add("ellipsis-button");

  const menu = document.createElement("ul");
  menu.classList.add("menu");

  let editMenuItem, deleteMenuItem, archiveMenuItem;

  editMenuItem = document.createElement("li");
  editMenuItem.classList.add("edit-menu-item");
  const editIcon = document.createElement("i");
  editIcon.classList.add("fas", "fa-edit");
  const editText = document.createTextNode(" Edit");
  editMenuItem.appendChild(editIcon);
  editMenuItem.appendChild(editText);
  editMenuItem.addEventListener("click", function (event) {
    event.stopPropagation();
    editNoteById(note.id);
  });

  deleteMenuItem = document.createElement("li");
  deleteMenuItem.classList.add("delete-menu-item");
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-trash-alt");
  const deleteText = document.createTextNode(" Delete");
  deleteMenuItem.appendChild(deleteIcon);
  deleteMenuItem.appendChild(deleteText);
  deleteMenuItem.addEventListener("click", function (event) {
    event.stopPropagation(); 
    deleteNoteById(note.id);
  });

  if (note.archived) {
    archiveMenuItem = document.createElement("li");
    archiveMenuItem.classList.add("archive-menu-item");
    const archiveIcon = document.createElement("i");
    archiveIcon.classList.add("fas", "fa-archive");
    const archiveText = document.createTextNode(" Unarchive");
    archiveMenuItem.appendChild(archiveIcon);
    archiveMenuItem.appendChild(archiveText);
    archiveMenuItem.addEventListener("click", function (event) {
      event.stopPropagation(); 
      unarchiveNoteById(note.id);
    });
  } else {
    archiveMenuItem = document.createElement("li");
    archiveMenuItem.classList.add("archive-menu-item");
    const archiveIcon = document.createElement("i");
    archiveIcon.classList.add("fas", "fa-archive");
    const archiveText = document.createTextNode(" Archive");
    archiveMenuItem.appendChild(archiveIcon);
    archiveMenuItem.appendChild(archiveText);
    archiveMenuItem.addEventListener("click", function (event) {
      event.stopPropagation();
      archiveNoteById(note.id);
    });
  }

  menu.appendChild(editMenuItem);
  menu.appendChild(deleteMenuItem);
  if (archiveMenuItem) {
    menu.appendChild(archiveMenuItem);
  }

  ellipsisButton.addEventListener("click", function (event) {
    event.stopPropagation();
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  });
  menu.addEventListener("mouseleave", function () {
    menu.style.display = "none";
  });

  actionButtons.appendChild(ellipsisButton);
  actionButtons.appendChild(menu);

  noteCard.appendChild(title);
  noteCard.appendChild(body);
  noteCard.appendChild(separator);
  noteCard.appendChild(createdAt);
  noteCard.appendChild(actionButtons);

  return noteCard;
}

document.addEventListener("DOMContentLoaded", function () {
  loadNotes();

  const addButton = document.getElementById("addButton");
  addButton.addEventListener("click", function () {
    const modalBg = document.getElementById("modalBg");
    modalBg.style.display = "block";
  });

  const closeButton = document.getElementById("closeButton");
  closeButton.addEventListener("click", function () {
    const modalBg = document.getElementById("modalBg");
    modalBg.style.display = "none";
    clearFormValidation();
  });

  const closeButtonBg = document.getElementById("closeButtonBg");
  closeButtonBg.addEventListener("click", function () {
    const modalBgNote = document.getElementById("modalBgNote");
    modalBgNote.style.display = "none";
  });

  const titleInput = document.getElementById("title");
  const titleErrorMessage = document.getElementById("titleErrorMessage");

  const descriptionInput = document.getElementById("description");
  const descriptionErrorMessage = document.getElementById(
    "descriptionErrorMessage"
  );

  titleInput.addEventListener("input", function () {
    validateTitle(titleInput.value);
  });

  descriptionInput.addEventListener("input", function () {
    validateDescription(descriptionInput.value);
  });

  titleInput.addEventListener("focusout", function () {
    validateTitle(titleInput.value);
  });
  
  descriptionInput.addEventListener("focusout", function () {
    validateDescription(descriptionInput.value);
  });

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();
    searchNotes(searchTerm);
  });

  const submitForm = document.getElementById("noteForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const titleValid = validateTitle(titleInput.value);
    const descriptionValid = validateDescription(descriptionInput.value);
    if (titleValid && descriptionValid) {
      addNote();
    }
  });
});
