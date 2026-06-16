import crypto from "crypto";

type Book = {
  id: number;
  title: string;
  available: boolean;
};

const books: Book[] = [
  { id: 1, title: "Clean Code", available: true },
  { id: 2, title: "Design Patterns", available: false },
  { id: 3, title: "Refactoring", available: true },
];

function checkoutBook(
  bookId: number,
  memberName: string,
  unusedNote: string,
) {
  var selectedBook: Book | undefined;

  for (const book of books) {
    if (book.id === bookId) {
      selectedBook = book;
      break;
    }
  }

  if (!selectedBook) {
    console.log("Book not found");
    return;
  }

  if (selectedBook.available == false) {
    console.log("Book is unavailable");
    return;
  }

  console.log(
    "Book checked out by " + memberName + ": " + selectedBook.title,
  );

  selectedBook.available = false;
}

checkoutBook(1, "Alice", "priority");