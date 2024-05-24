const books = [];
const event_render = "tugas-render";

document.addEventListener("DOMContentLoaded", () => {
  const formInput = document.getElementById("formInput");
  formInput.addEventListener("submit", (event) => {
    event.preventDefault();
    addBuku();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
  document.dispatchEvent(new Event(event_render)); // Menampilkan buku saat halaman dimuat
});

function addBuku() {
  const judulBuku = document.getElementById("inputJudul").value;
  const penulisBuku = document.getElementById("inputPenulis").value;
  const tahunBuku = parseInt(document.getElementById("inputTahun").value);
  const sudahDibaca = document.getElementById("inputSudahDibaca").checked;

  const generatedID = generatedId();
  const bukuObject = generateBukuObject(
    generatedID,
    judulBuku,
    penulisBuku,
    tahunBuku,
    sudahDibaca
  );
  books.push(bukuObject);

  document.dispatchEvent(new Event(event_render));
  saveData();
}

function generatedId() {
  return +new Date();
}

function generateBukuObject(id, judul, penulis, tahun, isCompleted) {
  return {
    id,
    judul,
    penulis,
    tahun: parseInt(tahun),
    isCompleted,
  };
}

document.addEventListener(event_render, () => {
  const uncompletedBookshelf = document.getElementById("bookShelf");
  uncompletedBookshelf.innerHTML = "";

  const completedBookshelf = document.getElementById("completedBooks");
  completedBookshelf.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeShelf(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookshelf.append(bookElement);
    } else {
      completedBookshelf.append(bookElement);
    }
  }
});

function makeShelf(bukuObject) {
  const textJudul = document.createElement("h3");
  textJudul.innerText = `Judul: ${bukuObject.judul}`;

  const textPenulis = document.createElement("p");
  textPenulis.innerText = `Penulis: ${bukuObject.penulis}`;

  const textTahun = document.createElement("p");
  textTahun.innerText = `Tahun terbit: ${bukuObject.tahun}`;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textJudul, textPenulis, textTahun);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${bukuObject.id}`);

  if (bukuObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undoButton");
    undoButton.innerText = "";

    undoButton.addEventListener("click", () => {
      undoTaskFromCompleted(bukuObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashButton");
    trashButton.innerText = "";

    trashButton.addEventListener("click", () => {
      removeTaskFromCompleted(bukuObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("checkButton");
    checkButton.innerText = "";

    checkButton.addEventListener("click", () => {
      addTaskToCompleted(bukuObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashButton");
    trashButton.innerText = "";

    trashButton.addEventListener("click", () => {
      removeTaskFromCompleted(bukuObject.id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

document.getElementById("formSearch").addEventListener("submit", function (e) {
  e.preventDefault();
  searchBook();
});

function searchBook() {
  const keyword = document
    .getElementById("searchBookJudul")
    .value.toLowerCase();

  const searchResults = books.filter((book) =>
    book.judul.toLowerCase().includes(keyword)
  );

  // Tampilkan hasil pencarian
  displaySearchResults(searchResults);
}

function displaySearchResults(results) {
  const searchResultsContainer = document.createElement("div");
  searchResultsContainer.classList.add("searchResults");
  document.querySelector("main").appendChild(searchResultsContainer);

  if (results.length === 0) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.textContent = "Tidak ada hasil yang ditemukan.";
    searchResultsContainer.appendChild(noResultsMessage);
  } else {
    results.forEach((book) => {
      const bookItem = makeShelf(book);
      searchResultsContainer.appendChild(bookItem);
    });
  }
}

document.addEventListener(event_render, () => {
  const uncompletedBookshelf = document.getElementById("bookShelf");
  uncompletedBookshelf.innerHTML = "";

  const completedBookshelf = document.getElementById("completedBooks");
  completedBookshelf.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeShelf(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookshelf.append(bookElement);
    } else {
      completedBookshelf.append(bookElement);
    }
  }
});

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(event_render));
  saveData();
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(event_render));
  saveData();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(event_render));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

const STORAGE_KEY = "saved-book";
const SAVED_EVENT = "BOOK_APPS";

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  } else {
    return true;
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(event_render));
}
