const form = document.getElementById("classroomForm");

form.addEventListener("submit", async function (event) {
  event.preventDefault(); //prevent page reload
  await fetchStudents();
});

async function fetchStudents() {
  // handle data from <input> and sanitize it to play nice in the URI
  const name = document.getElementById("classroomName").value.trim();
  const resultsDiv = document.getElementById("results");
  const input = document.getElementById("classroomName");

  // clear previous results & entry after submit
  resultsDiv.innerHTML = "";
  input.value = "";

  if (!name) {
    resultsDiv.innerHTML =
      "<p class='error'>Please enter a classroom name.</p>";
    return;
  }

  try {
    const response = await fetch(
      // safely transmit input data to be used in URI
      `/classroom/by-name?name=${encodeURIComponent(name)}`
    );
    if (!response.ok) {
      throw new Error("Classroom not found");
    }
    const data = await response.json(); // get our classroom

    if (data.length === 0) {
      resultsDiv.innerHTML = "<p>No students found.</p>";
      return;
    }

    const listItems = data
      .map(
        //these should have keys if we're using a framework,
        // but this is loosey-goosey javascript, baybee
        (classroom) => `
            <h2>${classroom.classroom_name}</h2>
            <ul>
              ${classroom.students
                .map((student) => `<li>${student.name} (${student.email})</li>`)
                .join("")}
            </ul>
          `
      )
      .join("");

    resultsDiv.innerHTML = listItems;
  } catch (err) {
    resultsDiv.innerHTML = `<p class='error'>${err.message}</p>`;
  }
}
function funnyMessage() {
  window.alert("LinkedIn is NOT for anarchists 😎");
}
