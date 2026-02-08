
let books = 
[
  { id: "B1", title: "The Girl in Room 105", author: "Chetan Prakash Bhagat", issued: false, issueDate: null },
  { id: "B2", title: "2 States: The Story of My Marriage", author: "Chetan Prakash Bhagat", issued: false, issueDate: null },
  { id: "B3", title: "Babban Billo: The Untold Story", author: "Kallo", issued: false, issueDate: null },
  { id: "B4", title: "Gitanjali", author: "Rabindranath Tagore", issued: false, issueDate: null },
  { id: "B5", title: "A Game of Thrones", author: "George R. R. Martin", issued: false, issueDate: null }
];

let students = 
[
  { id: "S1", name: "Shaktiman", class: "CS101", booksIssued: [] },
  { id: "S2", name: "Nobita", class: "CS102", booksIssued: [] },
  { id: "S3", name: "Harman Pampa", class: "CS103", booksIssued: [] },
  { id: "S4", name: "Shin Chan", class: "CS104", booksIssued: [] },
  { id: "S5", name: "CJ", class: "CS105", booksIssued: [] }
];

const adminUser = { username: "babban", password: "babban007" };

function login(event) {
  event.preventDefault();
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (user === adminUser.username && pass === adminUser.password) {
    document.getElementById("login").style.display = "none";
    document.getElementById("navBar").style.display = "block";
    showSection("dashboard");
  } else {
    document.getElementById("loginMessage").textContent = "Invalid credentials!";
  }
}

function logout() {
  document.getElementById("navBar").style.display = "none";
  document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
  document.getElementById("login").style.display = "block";
  document.getElementById("loginMessage").textContent = "You have logged out.";
}

function showSection(sectionId) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
  updateDashboard();
  renderBooks();
  renderStudents();
}

function updateDashboard() {
  document.getElementById("totalBooks").textContent = books.length;
  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("booksIssued").textContent = books.filter(b => b.issued).length;
}

function renderBooks() {
  let list = books.map(b => 
    `<p>${b.id} - ${b.title} by ${b.author} 
     ${b.issued ? `(Issued, Return by: ${b.returnDate.toLocaleDateString()})` : "(Available)"}</p>`
  ).join("");
  document.getElementById("bookList").innerHTML = list;
}

function renderStudents() {
  let list = students.map(s => 
    `<p>${s.id} - ${s.name} (${s.class}) | Books: ${s.booksIssued.join(", ") || "None"}</p>`
  ).join("");
  document.getElementById("studentList").innerHTML = list;
}

function issueBook(event) {
  event.preventDefault();
  let studentId = document.getElementById("studentId").value.trim();
  let bookId = document.getElementById("bookId").value.trim();

  let student = students.find(s => s.id === studentId);
  let book = books.find(b => b.id === bookId);

  if (!student) {
    alert("Student not found!");
    return;
  }
  if (!book) {
    alert("Book not found!");
    return;
  }
  if (book.issued) {
    alert("Book already issued!");
    return;
  }

  book.issued = true;
  book.issueDate = new Date();
  book.returnDate = new Date();
  book.returnDate.setDate(book.issueDate.getDate() - 10); // 30 days later
  student.booksIssued.push(book.id);

  alert(`Book "${book.title}" issued to ${student.name}. Return by: ${book.returnDate.toLocaleDateString()}`);
  updateDashboard();
  renderBooks();
  renderStudents();
}

function returnBook(event) {
  event.preventDefault();
  let bookId = document.getElementById("returnBookId").value.trim();
  let book = books.find(b => b.id === bookId);

  if (!book || !book.issued) {
    alert("Book not found or not issued!");
    return;
  }

  let student = students.find(s => s.booksIssued.includes(book.id));

  let today = new Date();
  let overdue = today > book.returnDate;
  let fine = overdue ? (Math.floor((today - book.returnDate) / (1000 * 60 * 60 * 24))) * 10 : 0;

  book.issued = false;
  book.issueDate = null;
  book.returnDate = null;
  if (student) {
    student.booksIssued = student.booksIssued.filter(b => b !== book.id);
  }

  document.getElementById("fineMessage").textContent = fine > 0 
    ? `Overdue! Fine: ₹${fine}` 
    : "Returned on time. No fine!";
  
  alert(`Book "${book.title}" returned successfully.`);
  updateDashboard();
  renderBooks();
  renderStudents();
}

function checkOverdueStudents() {
  let today = new Date();
  let overdueList = [];

  books.forEach(book => {
    if (book.issued && book.returnDate && today > book.returnDate) {
      let student = students.find(s => s.booksIssued.includes(book.id));
      if (student) {
        overdueList.push(`${student.name} (${student.id}) has not returned "${book.title}" (Due: ${book.returnDate.toLocaleDateString()})`);
      }
    }
  });

  if (overdueList.length > 0) {
    document.getElementById("overdueList").innerHTML = overdueList.map(item => `<p style="color:red;">${item}</p>`).join("");
  } else {
    document.getElementById("overdueList").innerHTML = "<p style='color:green;'>No overdue students</p>";
  }
}
