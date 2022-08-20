
const books = [];
const search = [];
const RENDER_EVENT = 'render-finishbook';

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addBook');
    const closeMenuButton = document.getElementById('closeMenu');
    const closeEditMenuButton = document.getElementById('closeEditMenu');
    const addBookButton = document.getElementById('addBookSubmit');
    const searchBookButton = document.getElementById('searchBookSubmit');

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    addButton.onclick = function() {
        displayMenu();
    }

    closeMenuButton.onclick = function() {
        closeMenuOption();
    }

    closeEditMenuButton.onclick = function() {
        closeEditMenuOption();
    }

    addBookButton.addEventListener('click', (e) => {
        e.preventDefault();
        addBookData();
    });

    searchBookButton.addEventListener('click', (e) => {
        e.preventDefault();
        addSearchResult();
    });
});

function displayMenu() {
    document.getElementById('addBookSection').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
}

function closeMenuOption() {
    Swal.fire({
        title: 'Anda yakin ingin membatalkan menambah buku ?',
        showDenyButton: true,
        confirmButtonText: 'Ya',
        denyButtonText: 'Tidak',
    }).then((result) => {
            if (result.isConfirmed) {
                closeMenu();
                Swal.fire({
                    title: 'Menambahkan buku dibatalkan',
                    text: '',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1300
                });
            } else if (result.isDenied) {
                return null;
            }
    });
}

function closeMenu() {
    document.getElementById('addBookSection').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
}

function addBookData() {
    const bookTitle = document.getElementById('titleBook').value;
    const bookAuthor = document.getElementById('authorBook').value;
    const bookYear = document.getElementById('yearBook').value;

    if (bookTitle != '' && bookAuthor != '' && bookYear != '') {
        const generatedID = generateId();
        if (document.getElementById('finishBook').checked == true) {
            const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, true);
            books.push(bookObject);
        } else {
            const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, false);
            books.push(bookObject);
        }
        console.log(books);
        document.dispatchEvent(new Event(RENDER_EVENT));
        Swal.fire({
            title: 'Berhasil Menambahkan Buku',
            text: '',
            icon: 'success'
        });
        closeMenu();
        document.getElementById('titleBook').value = null;
        document.getElementById('authorBook').value = null;
        document.getElementById('yearBook').value = null;
        saveData();
    } else {
        Swal.fire({
            title: 'Peringatan !',
            text: 'Harap lengkapi form terlebih dahulu',
            icon: 'warning',
            confirmButtonText: 'Mengerti'
        });
    }
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, () => {
    const unfinishedBookList = document.getElementById('unfinishedBook');
    unfinishedBookList.innerHTML = '';

    const finishedBookList = document.getElementById('finishedBook');
    finishedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if(!bookItem.isCompleted) {
            unfinishedBookList.append(bookElement);
        } else {
            finishedBookList.append(bookElement);
        }
    }
});

function makeBook(bookObject) {
    const textTitle = document.createElement('h5');
    textTitle.classList.add('text-lg');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.classList.add('text-slate-500');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.classList.add('text-slate-500');
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('capitalize');
    textContainer.classList.add('font-medium');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('book-card');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (!bookObject.isCompleted) {
        const editButton = document.createElement('button');
        editButton.classList.add('action-button');
        editButton.classList.add('hover:bg-cyan-500');
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

        editButton.addEventListener('click', () => {
            editBook(bookObject.id);
        });

        const finishedButton = document.createElement('button');
        finishedButton.classList.add('action-button');
        finishedButton.classList.add('hover:bg-green-500');
        finishedButton.innerHTML = '<i class="fa-solid fa-check"></i>';

        finishedButton.addEventListener('click', () => {
            moveBookToFinished(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('action-button');
        trashButton.classList.add('hover:bg-red-500');
        trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        trashButton.addEventListener('click', () => {
            removeBookFromList(bookObject.id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('mt-2');
        actionButton.append(editButton, finishedButton, trashButton);

        container.append(actionButton);
    } else {
        const editButton = document.createElement('button');
        editButton.classList.add('action-button');
        editButton.classList.add('hover:bg-cyan-500');
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

        editButton.addEventListener('click', () => {
            editBook(bookObject.id);
        });

        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('action-button');
        unfinishedButton.classList.add('hover:bg-rose-500');
        unfinishedButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        unfinishedButton.addEventListener('click', () => {
            moveBookToUnfinished(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('action-button');
        trashButton.classList.add('hover:bg-red-500');
        trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        trashButton.addEventListener('click', () => {
            removeBookFromList(bookObject.id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('mt-2');
        actionButton.append(editButton, unfinishedButton, trashButton);

        container.append(actionButton);
    }

    return container;
}

function moveBookToFinished(bookId) {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    Swal.fire({
        title: `Buku ${capitalize(bookTarget.title)} ditandai selesai dibaca`,
        text: '',
        icon: 'success',
        showConfirmButton: false,
        timer: 1300
    });
    saveData();
}

function moveBookToUnfinished(bookId) {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;
    console.log(bookTarget);
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    Swal.fire({
        title: `Buku ${capitalize(bookTarget.title)} ditandai belum selesai dibaca`,
        text: '',
        icon: 'error',
        showConfirmButton: false,
        timer: 1300
    });
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

function capitalize(s)
{
    return s && s[0].toUpperCase() + s.slice(1);
}

function removeBookFromList(bookId) {
    Swal.fire({
        title: 'Anda yakin ingin menghapus buku ini ?',
        showDenyButton: true,
        confirmButtonText: 'Ya',
        denyButtonText: 'Tidak',
    }).then((result) => {
        if (result.isConfirmed) {
            const bookTarget = findBookIndex(bookId);

            if (bookTarget === -1) return;
            books.splice(bookTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));

            Swal.fire('Buku Berhasil Dihapus!', '', 'success');
        } else if (result.isDenied) {
            Swal.fire('Mengapus Buku Dibatalkan!', '', 'error');
            return null;
        }
        saveData();
    });
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function addSearchResult() {
    search.pop();
    const searchBookTitle = document.getElementById('searchText');
    const searchTextTitle = document.getElementById('searchTitle');

    if (searchBookTitle.value.length < 1) {
        Swal.fire({
            title: 'Peringatan !',
            text: 'Isilah form terlebih dahulu',
            icon: 'warning',
            confirmButtonText: 'Mengerti'
        });
    } else {
        const searchTitle = generateTitle(searchBookTitle.value);
        search.push(searchTitle);
        searchTextTitle.classList.remove('hidden');
        searchResult(searchBookTitle.value);
        searchBookTitle.value = null;
    }
}

function generateTitle(title) {
    return {title};
}

function searchResult(searchItem) {
    const resultDisplay = document.getElementById('searchingBook');

    const result = books.filter((book) => {
        const bookTitle = book.title.toLowerCase();
        const searchKeyword = searchItem.toLowerCase();

        return bookTitle.includes(searchKeyword);
    });

    if (result.length == 0 || books.length == 0) {
        Swal.fire({
            title: 'Error !',
            text: 'Judul Buku Tidak Ditemukan',
            icon: 'error',
            confirmButtonText: 'Mengerti'
        });
    }

    for (const resultItem of result) {
        const resultElement = makeResult(resultItem);
        if (resultDisplay.childNodes.length > 0) {
            resultDisplay.innerHTML = '';
        }
        resultDisplay.append(resultElement);
    }
}

function makeResult(resultObject) {
    const textTitle = document.createElement('h5');
    textTitle.classList.add('text-lg');
    textTitle.innerText = resultObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.classList.add('text-slate-500');
    textAuthor.innerText = resultObject.author;

    const textYear = document.createElement('p');
    textYear.classList.add('text-slate-500');
    textYear.innerText = resultObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('capitalize');
    textContainer.classList.add('font-medium');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('book-card');
    container.append(textContainer);
    container.setAttribute('id', `book-${resultObject.id}`);

    if (!resultObject.isCompleted) {
        const editButton = document.createElement('button');
        editButton.classList.add('action-button');
        editButton.classList.add('hover:bg-cyan-500');
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

        editButton.addEventListener('click', () => {
            editBook(resultObject.id);
            emptyElement();
        });

        const finishedButton = document.createElement('button');
        finishedButton.classList.add('action-button');
        finishedButton.classList.add('hover:bg-green-500');
        finishedButton.innerHTML = '<i class="fa-solid fa-check"></i>';

        finishedButton.addEventListener('click', () => {
            moveBookToFinished(resultObject.id);
            emptyElement();
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('action-button');
        trashButton.classList.add('hover:bg-red-500');
        trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        trashButton.addEventListener('click', () => {
            removeBookFromList(resultObject.id);
            emptyElement();
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('mt-2');
        actionButton.append(editButton, finishedButton, trashButton);

        container.append(actionButton);
    } else {
        const editButton = document.createElement('button');
        editButton.classList.add('action-button');
        editButton.classList.add('hover:bg-cyan-500');
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

        editButton.addEventListener('click', () => {
            editBook(resultObject.id);
            emptyElement();
        });

        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('action-button');
        unfinishedButton.classList.add('hover:bg-rose-500');
        unfinishedButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        unfinishedButton.addEventListener('click', () => {
            moveBookToUnfinished(resultObject.id);
            emptyElement();
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('action-button');
        trashButton.classList.add('hover:bg-red-500');
        trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        trashButton.addEventListener('click', () => {
            removeBookFromList(resultObject.id);
            emptyElement();
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('mt-2');
        actionButton.append(editButton, unfinishedButton, trashButton);

        container.append(actionButton);
    }

    return container;
}

function emptyElement() {
    const resultDisplay = document.getElementById('searchingBook');
    resultDisplay.innerHTML = '';
    const searchTextTitle = document.getElementById('searchTitle');
    searchTextTitle.classList.add('hidden');
}

function editBook(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    
    editDisplay(bookTarget);
}

function editDisplay(bookItem) {
    document.getElementById('editBookSection').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');

    const editTitleBook = document.getElementById('editTitleBook');
    const editAuthorBook = document.getElementById('editAuthorBook');
    const editYearBook = document.getElementById('editYearBook');
    const editFinishedBookCheck = document.getElementById('editFinishBook');
    
    editTitleBook.value = bookItem.title;
    editAuthorBook.value = bookItem.author;
    editYearBook.value = bookItem.year;
    editFinishedBookCheck.checked = bookItem.isCompleted;

    const editBookButton = document.getElementById('editBookSubmit');
    editBookButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (editTitleBook.value != '' && editAuthorBook.value != '' && editYearBook.value != '') {
            bookItem.title = editTitleBook.value;
            bookItem.author = editAuthorBook.value;
            bookItem.year = editYearBook.value;
            if (editFinishedBookCheck.checked == true) {
                bookItem.isCompleted = true;
            } else {
                bookItem.isCompleted = false;
            }
            closeEditMenu();
            document.dispatchEvent(new Event(RENDER_EVENT));
            Swal.fire({
                title: 'Berhasil Mengedit Buku',
                text: '',
                icon: 'success'
            });
            saveData();
        } else {
            Swal.fire({
                title: 'Peringatan !',
                text: 'Harap lengkapi form terlebih dahulu',
                icon: 'warning',
                confirmButtonText: 'Mengerti'
            });
        }
    });
}

function closeEditMenuOption() {
    Swal.fire({
        title: 'Anda yakin ingin membatalkan mengedit buku ?',
        showDenyButton: true,
        confirmButtonText: 'Ya',
        denyButtonText: 'Tidak',
    }).then((result) => {
            if (result.isConfirmed) {
                closeEditMenu();
                Swal.fire({
                    title: 'Mengedit buku dibatalkan',
                    text: '',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1300
                });
            } else if (result.isDenied) {
                return null;
            }
    });
}

function closeEditMenu() {
    document.getElementById('editBookSection').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
}

const SAVED_EVENT = 'saved_book';
const STORAGE_KEY = 'BOOK_APPS';

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        Swal.fire({
            title: 'Error !',
            text: 'Maaf Browser Kamu Tidak Mendukung Local Storage',
            icon: 'warning',
        });
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const buku of data) {
            books.push(buku);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Dark mode toggle
const darkToggle = document.querySelector('#dark-toggle');
const html = document.querySelector('html');

darkToggle.addEventListener('click', () => {
    if (darkToggle.checked) {
        html.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        html.classList.remove('dark');
        localStorage.theme = 'light';
    }
});

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    darkToggle.checked = true;
  } else {
    darkToggle.checked = false;
  }