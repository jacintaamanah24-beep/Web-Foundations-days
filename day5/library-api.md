# Library Books API

This REST API allows users to manage books in a library. The API uses the `/books` resource and HTTP methods to perform CRUD operations.

## Endpoints

### 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of all books.
- **Success status:** `200 OK`

### 2. Get one book

- **Method:** GET
- **Path:** `/books/42`
- **Description:** Returns the details of the book with ID 42.
- **Success status:** `200 OK`

### 3. Create a book

- **Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book.
- **Request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958
}