import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showBrands } from "./brands.js";

let addEditDiv = null;
let name = null;
let logo = null;
let category = null;
let description = null;
let website = null;
let ecoFriendly = null;
let nonToxic = null;
let plasticFree = null;
let veganCrueltyFree = null;
let addingBrand = null;
let editCancel = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("add-brand-modal");
  name = document.getElementById("brand-name");
  logo = document.getElementById("brand-logo");
  category = document.getElementById("category");
  description = document.getElementById("description");
  website = document.getElementById("website");
  ecoFriendly = document.getElementById("eco-friendly");
  nonToxic = document.getElementById("non-toxic");
  plasticFree = document.getElementById("plastic-free");
  veganCrueltyFree = document.getElementById("vegan-cruelty-free");
  addingBrand = document.getElementById("save-brand");
  editCancel = document.getElementById("close-modal");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingBrand) {
        await handleAddOrEditBrand();
      } else if (e.target === editCancel) {
        closeModal()
      }
    }
  });
};

export const showAddEdit = async (brandId = null) => {
  message.textContent = "";
  enableInput(false);

  addEditDiv.style.display = 'flex';

  if (!brandId) {
    resetForm();
    addingBrand.textContent = "Add Brand";
    setDiv(addEditDiv);
    enableInput(true)
  } else {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/brands/${brandId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.status === 200) {
        name.value = data.brand.name || "";
        logo.value = data.brand.logo || "";
        category.value = data.brand.category || "";
        description.value = data.brand.description || "";
        website.value = data.brand.website || "";
        ecoFriendly.checked = data.brand.ecoFriendly || false;
        nonToxic.checked = data.brand.nonToxic || false;
        plasticFree.checked = data.brand.plasticFree || false;
        veganCrueltyFree.checked = data.brand.veganCrueltyFree || false;
        addingBrand.textContent = "Update Brand";
        addEditDiv.dateset.id = brandId;
      } else {
        message.textContent = "Brand not found";
        showBrands()
      }
    } catch (err) {
      console.error(err);
      message.textContent = "A communication error has occurred.";
      showBrands()
    }
    enableInput(true)
  }
};

const handleAddOrEditBrand = async () => {
  if (!token) {
    message.textContent = "Unauthorized! Please log in!";
    return;
  }

  const brandData = {
    name: name.value.trim(),
    logo: logo.value.trim(),
    category: category.value.trim(),
    description: description.value.trim(),
    website: website.value.trim(),
    ecoFriendly: ecoFriendly.checked,
    nonToxic: nonToxic.checked,
    plasticFree: plasticFree.checked,
    veganCrueltyFree: veganCrueltyFree.checked
  };

  if (!brandData.name || !brandData.logo || !brandData.category || !brandData.description || !brandData.website) {
    alert("Please fill out all fields.");
    return
  }

  enableInput(false);

  let method = addEditDiv.dataset.id ? "PATCH" : "POST";
  let url = addEditDiv.dataset.id
    ? `http://localhost:3001/api/v1/brands/${addEditDiv.dataset.id}`
    : "http://localhost:3001/api/v1/brands";

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(brandData),
    });

    const data = await response.json();

    if (response.ok) {
      message.textContent = addEditDiv.dataset.id
        ? "Brand updated successfully!"
        : "Brand added successfully!";

        if (addEditDiv.dataset.id) {
          const updatedBrandId = addEditDiv.dataset.id;
          const updatedRow = brandsTable.querySelector(`button[data-id='${updatedBrandId}']`).closest("tr");
          updatedRow.querySelector(".brand-logo").src = brandData.logo;
          updatedRow.querySelector(".brand-name").textContent = brandData.name;
          updatedRow.querySelector(".brand-category").textContent = brandData.category;
          updatedRow.querySelector(".eco-friendly").textContent = brandData.ecoFriendly ? "🌱 EF" : "";
          updatedRow.querySelector(".non-toxic").textContent = brandData.nonToxic ? "🚫 NT" : "";
          updatedRow.querySelector(".plastic-free").textContent = brandData.plasticFree ? "♻️ PF" : "";
          updatedRow.querySelector(".vegan").textContent = brandData.veganCrueltyFree ? "🐰 VC" : "";
        };

      resetForm();
      showBrands()
    } else {
      message.textContent = data.msg || "Something went wrong!";
    }
  } catch (err) {
    console.error(err);
    message.textContent = "A communication error occurred";
  }

  enableInput(true)
};

const resetForm = () => {
  name.value = '';
  logo.value = '';
  category.value = '';
  description.value = '';
  website.value = '';
  ecoFriendly.checked = false;
  nonToxic.checked = false;
  plasticFree.checked = false;
  veganCrueltyFree.checked = false;
  delete addEditDiv.dataset.id;
};

const closeModal = () => {
  resetForm();
  addEditDiv.style.display = 'none';
  showBrands()
};

