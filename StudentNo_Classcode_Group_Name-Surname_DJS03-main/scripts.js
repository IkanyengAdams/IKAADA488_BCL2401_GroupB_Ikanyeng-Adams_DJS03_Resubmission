import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'




    initialize() {
        this.populateBookPreviews(this.matches.slice(0, BOOKS_PER_PAGE));
        this.populateDropdown('[data-search-genres]', genres, 'All Genres');
        this.populateDropdown('[data-search-authors]', authors, 'All Authors');
        this.applyThemeSettings();
        this.setupEventListeners();
        this.updateShowMoreButton();
      }


createBookPreview({ author, id, image, title }) {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;

    return element;
}

bookPreviewsPopulation(booklist) {
    const fragment = document.createDocumentFragment();
    bookList.forEach(book => fragment.appendChild(this.createBookPreview(book)));
    document.querySelector('[data-list-items]').appendChild(fragment);
}

populateDropdown(selector, items, defaultOption) {
    const fragment = document.createDocumentFragment();
    const firstElement = document.createElement('option');
    firstElement.value = 'any';
    firstElement.innerText = defaultOption;
    fragment.appendChild(firstElement);

    Object.entries(items).forEach(([id, name]) => {
      const optionElement = document.createElement('option');
      optionElement.value = id;
      optionElement.innerText = name;
      fragment.appendChild(optionElement);
    });

    document.querySelector(selector).appendChild(fragment);
}

applyThemeSettings() {
    const themeSettings = document.querySelector('[data-settings-theme]');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersDarkScheme) {
      themeSettings.value = 'night';
      document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
      document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
      themeSettings.value = 'day';
      document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
      document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
}

setupEventListeners() {
    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = false;
      });
  
      document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = false;
      });
  
      document.querySelector('[data-header-search]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = true;
        document.querySelector('[data-search-title]').focus();
      });
  
      document.querySelector('[data-header-settings]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = true;
      });
  
      document.querySelector('[data-list-close]').addEventListener('click', () => {
        document.querySelector('[data-list-active]').open = false;
      });
  
      document.querySelector('[data-settings-form]').addEventListener('submit', this.handleThemeChange.bind(this));
      document.querySelector('[data-search-form]').addEventListener('submit', this.handleSearch.bind(this));
      document.querySelector('[data-list-button]').addEventListener('click', this.showMoreBooks.bind(this));
      document.querySelector('[data-list-items]').addEventListener('click', this.handleBookClick.bind(this));
}

handleThemeChange(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === 'night') {
      document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
      document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
      document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
      document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }

    document.querySelector('[data-settings-overlay]').open = false;
}

handleSearch() {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = this.filterBooks(filters);

    this.page = 1;
    this.matches = result;

    if (result.length < 1) {
      document.querySelector('[data-list-message]').classList.add('list__message_show');
    } else {
      document.querySelector('[data-list-message]').classList.remove('list__message_show');
    }

    document.querySelector('[data-list-items]').innerHTML = '';
    this.bookPreviewsPopulation(result.slice(0, BOOKS_PER_PAGE));
    this.updateShowMoreButton();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('[data-search-overlay]').open = false;
}


filterBooks(filters) {
    return books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        return genreMatch && titleMatch && authorMatch;
      });
}

updateShowMoreButton() {
    const button = document.querySelector('[data-list-button]');
    button.disabled = (this.matches.length - (this.page * BOOKS_PER_PAGE)) < 1;
    button.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${Math.max(this.matches.length - (this.page * BOOKS_PER_PAGE), 0)})</span>
    `;
}

showMoreBooks() {
    const fragment = document.createDocumentFragment();
    const booksToShow = this.matches.slice(this.page * BOOKS_PER_PAGE, (this.page + 1) * BOOKS_PER_PAGE);
    booksToShow.forEach(book => fragment.appendChild(this.createBookPreview(book)));

    document.querySelector('[data-list-items]').appendChild(fragment);
    this.page += 1;
    this.updateShowMoreButton();
}

handleBookClick(event) {
    const pathArray = Array.from(event.path || event.composedPath());
    const previewElement = pathArray.find(node => node?.dataset?.preview);

    if (previewElement) {
      const activeBook = books.find(book => book.id === previewElement.dataset.preview);
      this.showBookDetails(activeBook);
    }
}

showBookDetails(book) {
    if (book) {
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = book.image;
        document.querySelector('[data-list-image]').src = book.image;
        document.querySelector('[data-list-title]').innerText = book.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = book.description;
      }
    }
}






