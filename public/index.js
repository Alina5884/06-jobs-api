let activeDiv = null;

export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value); 
  } else {
    localStorage.removeItem("token");
  }
};

export let message = null;

import { showBrands, handleBrands } from "./brands.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  message = document.getElementById("message");

  handleLoginRegister();
  handleLogin();
  handleBrands();
  handleRegister();
  handleAddEdit();

  if (token) {
    showBrands();
  } else {
    showLoginRegister();
  }

 
  const brandCards = document.querySelectorAll('.brand-card');
  brandCards.forEach(card => {
    card.addEventListener('click', () => {
      const brandDetails = card.querySelector('.brand-details');
      brandDetails.style.display = brandDetails.style.display === 'none' ? 'block' : 'none';
    });
  });

  const editButtons = document.querySelectorAll('.edit-brand');
  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); 
      const card = button.closest('.brand-card');
      const brandData = getBrandData(card); 
      showAddEdit(brandData); 
    });
  });

  const deleteButtons = document.querySelectorAll('.delete-brand');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); 
      const card = button.closest('.brand-card');
      const brandData = getBrandData(card); 
      deleteBrand(brandData)
    })
  })
});


const getBrandData = (card) => {
  const brandName = card.querySelector('h3').textContent;
  const brandCategory = card.querySelector('p').textContent.replace('Category: ', '');
  return { name: brandName, category: brandCategory }
};

const deleteBrand = (brandData) => {

  console.log("Deleting brand: ", brandData);
 
  const brandCard = document.querySelector(`#brand-${brandData.name}`);
  brandCard.remove();
};

