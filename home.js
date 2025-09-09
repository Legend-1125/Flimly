const API_BASE = "http://localhost:5000";

// ---------------- Navbar ----------------
function loadNavbar() {
    const navbar = document.getElementById("navbar");
    navbar.style.background = "#222";
    navbar.style.padding = "1rem";
    navbar.style.marginBottom = "1rem";

    // Home link
    const homeLink = document.createElement("a");
    homeLink.href = "index.html";
    homeLink.textContent = "Home";
    homeLink.style.color = "white";
    homeLink.style.marginRight = "1rem";
    navbar.appendChild(homeLink);

    // Sign Up link
    const signUpLink = document.createElement("a");
    signUpLink.href = "signup.html";
    signUpLink.textContent = "Sign Up";
    signUpLink.style.color = "white";
    signUpLink.style.marginRight = "1rem";
    navbar.appendChild(signUpLink);

    // Sign In link
    const signInLink = document.createElement("a");
    signInLink.href = "signin.html";
    signInLink.textContent = "Sign In";
    signInLink.style.color = "white";
    navbar.appendChild(signInLink);

    // Login check
    const user = localStorage.getItem("user");
    if (user) {
        signInLink.style.display = "none";
        signUpLink.style.display = "none";

        const userSpan = document.createElement("span");
        userSpan.textContent = `Welcome, ${user}`;
        userSpan.style.color = "white";
        userSpan.style.marginLeft = "1rem";

        const logoutBtn = document.createElement("button");
        logoutBtn.textContent = "Logout";
        logoutBtn.style.marginLeft = "1rem";
        logoutBtn.onclick = () => {
            localStorage.removeItem("user");
            location.reload();
        };

        navbar.appendChild(userSpan);
        navbar.appendChild(logoutBtn);
    }
}

// Call navbar function
loadNavbar();

// ---------------- Movie Search & Cards ----------------
async function loadMovies() {
    const query = document.getElementById("search").value;
    const res = await fetch(`${API_BASE}/search?title=${encodeURIComponent(query)}`);
    const movies = await res.json();

    const list = document.getElementById("movieList");
    list.innerHTML = "";

    if (movies.length === 0) {
        list.innerHTML = "<p>No movies found.</p>";
        return;
    }

    movies.forEach(movie => {
        const div = document.createElement("div");
        div.className = "movie-card";
        div.innerHTML = `
            <img src="${movie.poster || 'https://via.placeholder.com/180x270?text=No+Image'}" alt="${movie.title}" />
            <div class="overlay">
                <h3>${movie.title}</h3>
                <p>Platform: ${movie.platform}</p>
                <p>Availability: ${movie.availability}</p>
                <p>Price: ${movie.price ? "$"+movie.price : "Included in subscription"}</p>
                <p>Quality: ${movie.quality.join(", ")}</p>
                <p>Region: ${movie.region}</p>
                <a href="${movie.link}" target="_blank"><button>Watch on Platform</button></a>
            </div>
        `;
        list.appendChild(div);
    });
}

// Search on page load (optional)
loadMovies();
