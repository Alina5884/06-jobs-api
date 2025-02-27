import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    token,
    enableInput,
  } from "./index.js";
  import { showLoginRegister } from "./loginRegister.js";
  import { showAddEdit } from "./addEdit.js";
  
  let brandsDiv = null;
  let brandsTable = null;
  let brandsTableHeader = null;
  
  export const handleBrands = () => {
    brandsDiv = document.getElementById("brands");
    const logoff = document.getElementById("logoff");
    const addBrand = document.getElementById("add-brand");
    brandsTable = document.getElementById("brands-table");
    brandsTableHeader = document.getElementById("brands-table-header");

    brandsDiv.addEventListener("click", async (e) => {
      if (inputEnabled && e.target.nodeName === "BUTTON") {
        if (e.target === addBrand) {
          showAddEdit(null)
        } else if (e.target === logoff) {
          handleLogoff()
        } else if (e.target.classList.contains("edit-brand")) {
          const brandId = e.target.dataset.id;
          if (brandId) {
          message.textContent = "";
          showAddEdit(brandId)
          }
        } else if (e.target.classList.contains("delete-brand")) {
          await handleDeleteBrand(e.target.dataset.id)
        }
      }
    })
  };

  const handleDeleteBrand = async (brandId) => {
    if (!token) {
      message.textContent = "Unauthorized! Please log in!";
      return;
    }
  
    if (!confirm("Are you sure you want to delete this brand?")) return;
  
    try {
      const response = await fetch(`http://localhost:3001/api/v1/brands/${brandId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        message.textContent = "Brand deleted successfully!";

        const rowToDelete = brandsTable.querySelector(`button[data-id='${brandId}']`).closest("tr");
        
        if (rowToDelete) rowToDelete.remove();
          showBrands()
       
        } else {
          message.textContent = data.msg || "Something went wrong!";
        }
    } catch (err) {
      console.error(err);
      message.textContent = "A communication error occurred.";
    }
  };

  const handleLogoff = () => {
    setToken(null);
    message.textContent = "You have been logged out";

    if (brandsTable) {
      brandsTable.replaceChildren([brandsTableHeader]);
    };
    showLoginRegister()
  };

  export const showBrands = async () => {
    try {
      enableInput(false);
  
      const response = await fetch("http://localhost:3001/api/v1/brands", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
  
      const data = await response.json();
      let children = [brandsTableHeader];
  
      if (response.status === 200) {
        if (data.count === 0) {
          brandsTable.replaceChildren(...children);
        } else {
          const rows = brandsTable.querySelectorAll("tr");
          rows.forEach(row => row.remove());
          
          data.brands.forEach((brand) => {
            let rowEntry = document.createElement("tr");
  
            let editButton = `<td><button type="button" class="edit-brand" data-id="${brand._id}">Edit</button></td>`;
            let deleteButton = `<td><button type="button" class="delete-brand" data-id="${brand._id}">Delete</button></td>`;
            let rowHTML = `
              <td><img src="${brand.logo}" alt="brand logo" class="brand-logo" /></td>
              <td>${brand.name}</td>
              <td>${brand.category}</td>
              <td>
                <span class="eco-friendly">${brand.ecoFriendly ? "🌱 EF" : ""}</span>
                <span class="non-toxic">${brand.nonToxic ? "🚫 NT" : ""}</span>
                <span class="plastic-free">${brand.plasticFree ? "♻️ PF" : ""}</span>
                <span class="vegan">${brand.veganCrueltyFree ? "🐰 VC" : ""}</span>
              </td>
              <td>
                <button class="view-details" data-id="${brand._id}">View Details</button>
                ${editButton} ${deleteButton}
              </td>`;
  
            rowEntry.innerHTML = rowHTML;
            children.push(rowEntry);
          });

          brandsTable.replaceChildren(...children);
        }
      } else {
        message.textContent = data.msg
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred."
    }
    enableInput(true);
    setDiv(brandsDiv)
  };
  