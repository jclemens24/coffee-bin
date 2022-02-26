import { errorMessage } from './productForm.js';

const shopperForm = document.querySelector('.shopper_form');

function validateShopperForm() {
  const shopperFormValid = shopperForm.checkValidity();
  if (shopperFormValid) {
    errorMessage.textContent = 'Success!';
    errorMessage.style.color = '#37b24d';
  }
  return shopperFormValid;
}

export const processShopperFormData = function (e) {
  e.preventDefault();
  const isValid = validateShopperForm();
  if (isValid) {
    const captureData = {
      name: shopperForm.fullName.value,
      email: shopperForm.email.value,
      phone: shopperForm.phone.value,
      birthday: shopperForm.birthday.value,
      streetAddress: shopperForm.streetAddress.value,
      state: shopperForm.state.value,
      zip: shopperForm.zip.value
    };
    console.log(captureData);
    // window.location.assign(`/views/index.html`);
  }
};
