async function fetchBooks(query) {
  const BASE_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}`;

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("HTTP ERROR");

    const data = await response.json();

    const books = data.items
      .slice(0, 10)
      .filter((book) => book.volumeInfo)
      .map((book) => {
        const info = book.volumeInfo;
        return {
          title: info.title || "No title",
          author: info.authors?.join(", ") || "Unknown author",
          year: info.publishedDate?.slice(0, 4) || "Unknown year",
          link: info.infoLink || "#",
        };
      });

    renderBooks(books);
  } catch (error) {
    console.error("Error loading books:", error);
  }
}

function renderBooks(books) {
  const container = document.getElementById("booksContainer");
  container.innerHTML = "";

  if (books.length === 0) {
    container.innerHTML = "<p>No books found.</p>";
    return;
  }

  books.forEach((book, index) => {
    const div = document.createElement("div");
    div.classList.add("book");
    div.innerHTML = `
        <strong>${index + 1}. ${book.title}</strong> (${book.year})<br/>
        <em>${book.author}</em><br/>
        <a href="${book.link}" target="_blank">Read more</a>
      `;
    container.appendChild(div);
  });
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    fetchBooks(query);
  }
});
