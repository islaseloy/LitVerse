document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);

    const authorId = params.get('authorId');
    const bookIndex = params.get('bookIndex');

    const bookCoverElement = document.getElementById('book-cover');
    const bookTitleElement = document.getElementById('book-title');
    const bookAuthorElement = document.getElementById('book-author');

    const purchaseForm = document.getElementById('purchase-form');
    const successOverlay = document.getElementById('success-overlay');

    async function loadBookData() {
        if (!authorId || !bookIndex) {
            console.error("Error: Faltan parámetros en la URL (authorId o bookIndex).");
            document.querySelector('.checkout-container').innerHTML = '<h1>Error: No se ha podido cargar el libro.</h1><a href="index.html">Volver al inicio</a>';
            return;
        }

        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo data.json');
            }
            const authors = await response.json();

            const author = authors.find(a => a.id.toString() === authorId);

            if (author && author.books[bookIndex]) {
                const book = author.books[bookIndex];

                bookCoverElement.src = book.coverImage || 'pictures/placeholder_cover.png';
                bookCoverElement.alt = `Portada de ${book.title}`;
                bookTitleElement.textContent = book.title;
                bookAuthorElement.textContent = `por ${author.name}`;
            } else {
                console.error("No se encontró el autor o el libro con los IDs proporcionados.");
                document.querySelector('.checkout-container').innerHTML = '<h1>Error: Libro no encontrado.</h1><a href="index.html">Volver al inicio</a>';
            }
        } catch (error) {
            console.error("Hubo un problema al cargar los datos del libro:", error);
        }
    }


    if (purchaseForm) {
        purchaseForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (successOverlay) {
                successOverlay.classList.remove('hidden');
            }
        });
    }

    loadBookData();
});