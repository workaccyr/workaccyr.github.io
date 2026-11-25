//Main Core Logic Goes Here

// Starter recipes if none are saved yet
let defaultRecipes = [
  { id: 1, title: "Avocado & Egg Toast", category: "Breakfast", time: 10, calories: 340, ingredients: "Sourdough bread, avocado, 2 eggs, salt", instructions: "Toast bread, mash avocado, top with eggs.", favorite: true },
  { id: 2, title: "Chickpea Salad", category: "Lunch", time: 15, calories: 410, ingredients: "Chickpeas, cucumber, tomatoes, feta, olive oil", instructions: "Chop veggies and toss with chickpeas and olive oil.", favorite: false },
  { id: 3, title: "Garlic Butter Salmon", category: "Dinner", time: 25, calories: 520, ingredients: "Salmon fillet, asparagus, butter, garlic, lemon", instructions: "Bake at 200°C for 15 minutes with garlic butter.", favorite: true }
];

// Load data from localStorage
let recipes = JSON.parse(localStorage.getItem("recipes")) || defaultRecipes;
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
let foodLogs = JSON.parse(localStorage.getItem("foodLogs")) || [];

function saveAll() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  localStorage.setItem("foodLogs", JSON.stringify(foodLogs));
}

// Update navbar login status on every page
let navLink = document.getElementById("nav-profile-link");
let authWarning = document.getElementById("auth-warning");
let banner = document.getElementById("welcome-banner");

if (currentUser) {
  if (navLink) navLink.textContent = "👤 " + currentUser.name;
  if (authWarning) authWarning.classList.add("hidden");
  if (banner) banner.textContent = "Welcome back, " + currentUser.name + "!";
} else {
  if (navLink) navLink.textContent = "Sign In";
  if (authWarning) authWarning.classList.remove("hidden");
}

// --- 1. RECIPES PAGE (index.html) ---
let recipeGrid = document.getElementById("recipe-grid");
if (recipeGrid) {
  function showRecipes() {
    let search = document.getElementById("search-input").value.toLowerCase();
    let cat = document.getElementById("category-filter").value;
    recipeGrid.innerHTML = "";

    for (let i = 0; i < recipes.length; i++) {
      let r = recipes[i];
      let matchText = r.title.toLowerCase().includes(search) || r.ingredients.toLowerCase().includes(search);
      let matchCat = (cat === "All") || (cat === "Favorites" && r.favorite) || (r.category === cat);

      if (matchText && matchCat) {
        let favText = r.favorite ? "★ Saved" : "☆ Save";
        recipeGrid.innerHTML += `
          <div class="card">
            <span class="badge">${r.category}</span>
            <h3>${r.title}</h3>
            <div class="recipe-meta"><span>⏱ ${r.time} mins</span><span>🔥 ${r.calories} kcal</span></div>
            <p><strong>Ingredients:</strong> ${r.ingredients}</p>
            <p style="font-size: 0.85rem; color: var(--muted);">${r.instructions}</p>
            <div class="recipe-actions">
              <button class="btn btn-outline" onclick="toggleFav(${i})">${favText}</button>
              <button class="btn btn-danger" onclick="deleteRecipe(${i})">Delete</button>
            </div>
          </div>`;
      }
    }
  }

  window.toggleFav = function(index) {
    recipes[index].favorite = !recipes[index].favorite;
    saveAll();
    showRecipes();
  };

  window.deleteRecipe = function(index) {
    recipes.splice(index, 1);
    saveAll();
    showRecipes();
  };

  document.getElementById("recipe-form").addEventListener("submit", function(e) {
    e.preventDefault();
    recipes.unshift({
      id: Date.now(),
      title: document.getElementById("recipe-title").value,
      category: document.getElementById("recipe-category").value,
      time: document.getElementById("recipe-time").value,
      calories: Number(document.getElementById("recipe-calories").value),
      ingredients: document.getElementById("recipe-ingredients").value,
      instructions: document.getElementById("recipe-instructions").value,
      favorite: true
    });
    saveAll();
    this.reset();
    showRecipes();
  });

  document.getElementById("search-input").addEventListener("input", showRecipes);
  document.getElementById("category-filter").addEventListener("change", showRecipes);
  showRecipes();
}

// --- 2. PROFILE PAGE (profile.html) ---
let authForms = document.getElementById("auth-forms");
if (authForms) {
  let dashboard = document.getElementById("profile-dashboard");

  function checkLogin() {
    if (currentUser) {
      authForms.classList.add("hidden");
      dashboard.classList.remove("hidden");
      document.getElementById("profile-name").textContent = "Welcome, " + currentUser.name + "!";
      document.getElementById("profile-email").textContent = currentUser.email;
      document.getElementById("stat-recipes").textContent = recipes.length;
      document.getElementById("stat-favorites").textContent = recipes.filter(r => r.favorite).length;
      document.getElementById("stat-logs").textContent = foodLogs.length;
    } else {
      authForms.classList.remove("hidden");
      dashboard.classList.add("hidden");
    }
  }

  document.getElementById("register-form").addEventListener("submit", function(e) {
    e.preventDefault();
    let name = document.getElementById("reg-name").value;
    let email = document.getElementById("reg-email").value;
    let password = document.getElementById("reg-password").value;

    users.push({ name: name, email: email, password: password });
    currentUser = { name: name, email: email };
    saveAll();
    location.reload();
  });

  document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email && users[i].password === password) {
        currentUser = { name: users[i].name, email: users[i].email };
        saveAll();
        location.reload();
        return;
      }
    }
    alert("Wrong email or password!");
  });

  document.getElementById("logout-btn").addEventListener("click", function() {
    currentUser = null;
    saveAll();
    location.reload();
  });

  checkLogin();
}

// --- 3. MEAL PLANNER PAGE (planning.html) ---
let plannerGrid = document.getElementById("planner-grid");
if (plannerGrid) {
  let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let recipeSelect = document.getElementById("plan-recipe");

  for (let i = 0; i < recipes.length; i++) {
    recipeSelect.innerHTML += `<option value="${recipes[i].title}">${recipes[i].title}</option>`;
  }

  function showPlan() {
    plannerGrid.innerHTML = "";
    for (let i = 0; i < days.length; i