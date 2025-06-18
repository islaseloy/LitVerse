document.addEventListener('DOMContentLoaded', () => {
    const genreButtons = document.querySelectorAll('.genre-btn');
    const body = document.body;
    const authorsGrid = document.querySelector('.authors-grid');
    const modal = document.getElementById('author-modal');
    const closeModalBtn = document.querySelector('.modal .close-btn');
    const contactNavLink = document.getElementById('contact-nav-link');

    let authorsData = [];

    function renderAuthorCards(selectedGenre) {
        if (!authorsGrid) return;
        authorsGrid.innerHTML = '';

        if (authorsData.length === 0 && selectedGenre) {
            console.warn(`renderAuthorCards called for ${selectedGenre} but authorsData is empty or not yet loaded.`);
            authorsGrid.innerHTML = '<p class="no-authors">Loading authors...</p>';
            return;
        }

        const filteredAuthors = authorsData.filter(author => author.genre === selectedGenre);

        if (filteredAuthors.length === 0) {
            authorsGrid.innerHTML = `<p class="no-authors">No authors found for '${selectedGenre}'. Explore another!</p>`;
            return;
        }

        filteredAuthors.forEach(author => {
            const card = document.createElement('div');
            card.classList.add('author-card');
            card.dataset.authorId = author.id;
            const photoSrc = author.photo && author.photo.trim() !== "" ? author.photo : 'pictures/placeholder_author.png';
            card.innerHTML = `
                <img src="${photoSrc}" alt="${author.name}" class="author-card-img">
                <h3>${author.name}</h3>
            `;
            authorsGrid.appendChild(card);
        });
    }

    function setupEventListeners() {
        if (genreButtons.length > 0) {
            genreButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const selectedGenre = button.dataset.genre;
                    genreButtons.forEach(btn => btn.classList.remove('active-genre'));
                    button.classList.add('active-genre');
                    
                    body.className = '';
                    body.classList.add(`theme-${selectedGenre}`);
                    
                    renderAuthorCards(selectedGenre);
                });
            });
        }

        if (authorsGrid) {
            authorsGrid.addEventListener('click', (event) => {
                const card = event.target.closest('.author-card');
                if (card) {
                    const authorId = card.dataset.authorId;
                    const author = authorsData.find(a => a.id.toString() === authorId);

                    if (author) {
                        const modalAuthorImg = document.getElementById('modal-author-img');
                        const modalAuthorName = document.getElementById('modal-author-name');
                        const modalAuthorBio = document.getElementById('modal-author-bio');
                        const booksGridModal = document.getElementById('modal-books-grid');

                        if (modalAuthorImg) {
                            modalAuthorImg.src = author.photo && author.photo.trim() !== "" ? author.photo : 'pictures/placeholder_author.png';
                            modalAuthorImg.alt = author.name;
                        }
                        if (modalAuthorName) modalAuthorName.textContent = author.name;
                        if (modalAuthorBio) modalAuthorBio.innerHTML = author.bio.split('\n\n').map(p => `<p>${p}</p>`).join('');
                        
                        if (booksGridModal) {
                            booksGridModal.innerHTML = '';
                            if (author.books && author.books.length > 0) {
                                author.books.forEach(book => {
                                    const bookCardFlip = document.createElement('div');
                                    bookCardFlip.classList.add('book-card-flip');
                                    const coverSrc = (book.coverImage && book.coverImage.trim() !== "") ? book.coverImage : 'pictures/placeholder_cover.png';
                                    bookCardFlip.innerHTML = `
                                        <div class="book-card-flip-inner">
                                            <div class="book-card-front">
                                                <img src="${coverSrc}" alt="${book.title} Cover">
                                            </div>
                                            <div class="book-card-back">
                                                <h4>${book.title}</h4>
                                                ${book.year ? `<span class="book-year">(${book.year})</span>` : ''}
                                                <p>${book.description || "No description available."}</p>
                                            </div>
                                        </div>
                                    `;
                                    booksGridModal.appendChild(bookCardFlip);
                                    bookCardFlip.addEventListener('click', (e) => {
                                        e.stopPropagation(); 
                                        bookCardFlip.classList.toggle('is-flipped');
                                    });
                                });
                            } else {
                                booksGridModal.innerHTML = "<p>No books listed for this author.</p>";
                            }
                        }
                        if (modal) modal.classList.add('show');
                    } else {
                        console.warn("Author not found in data for ID:", authorId);
                    }
                }
            });
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                if (modal) modal.classList.remove('show');
            });
        }

        window.addEventListener('click', (event) => {
            if (modal && event.target === modal) {
                modal.classList.remove('show');
            }
        });

        if (contactNavLink) {
            contactNavLink.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId.startsWith("#") && (window.location.pathname.includes('index.html') || window.location.pathname === '/')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        document.querySelectorAll('header nav a').forEach(navLink => navLink.classList.remove('active'));
                        this.classList.add('active');
                        const homeLink = document.querySelector('header nav a[href="index.html"], header nav a[href="/"]');
                        if(homeLink && homeLink !== this) homeLink.classList.remove('active');
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }

        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        const currentHash = window.location.hash;

        document.querySelectorAll('header nav a').forEach(navLink => {
            navLink.classList.remove('active');
            let linkPath = navLink.getAttribute('href').split("#")[0];
            if (linkPath === "" || linkPath === "/") linkPath = "index.html"; 

            const linkHash = navLink.hash;

            if (linkPath === currentPath) {
                if (currentHash && linkHash === currentHash) {
                    navLink.classList.add('active');
                } else if (!currentHash && !linkHash) {
                    navLink.classList.add('active');
                }
            }
        });

        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                alert('Datos enviados! Gracias por escribirnos');
                contactForm.reset();
            });
        }
    }

    function initializePage() {
        setupEventListeners();

        if (authorsGrid && genreButtons.length > 0) {
            let initialGenre = 'fiction';
            let initialActiveButton = document.querySelector('.genre-btn.active-genre');

            if (initialActiveButton) {
                initialGenre = initialActiveButton.dataset.genre;
            } else if (genreButtons.length > 0) {
                initialActiveButton = genreButtons[0];
                initialActiveButton.classList.add('active-genre');
                initialGenre = initialActiveButton.dataset.genre;
            }
            
            body.className = '';
            body.classList.add(`theme-${initialGenre}`);
            renderAuthorCards(initialGenre);
        } else if (document.body.classList.contains('theme-about')) {
            
        } else {
            
        }
    }

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} while fetching data.json. URL: ${response.url}`);
            }
            return response.json();
        })
        .then(data => {
            authorsData = data;
            console.log("Data loaded successfully. Total authors:", authorsData.length);
            initializePage(); 
        })
        .catch(error => {
            console.error('CRITICAL ERROR: Could not load or parse data.json or initialize page:', error);
            if (authorsGrid) {
                 authorsGrid.innerHTML = '<p class="no-authors" style="color: red; font-weight: bold;">Error: Could not load author data. The library is currently empty. Please try refreshing the page or contact support if the issue persists.</p>';
            } else {
                const mainElement = document.querySelector('main');
                if(mainElement) {
                    const errorP = document.createElement('p');
                    errorP.textContent = "Error: Could not load essential data for the page.";
                    errorP.style.color = "red";
                    errorP.style.textAlign = "center";
                    errorP.style.padding = "20px";
                    mainElement.prepend(errorP);
                }
            }
        });
});