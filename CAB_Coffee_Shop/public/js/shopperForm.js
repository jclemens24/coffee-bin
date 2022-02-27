const shopperForm = document.querySelector('.shopper_form');
const errorMessage = document.getElementById('message');
const input = document.querySelector('input');

function validateShopperForm() {
  const shopperFormValid = shopperForm.checkValidity();
  if (shopperFormValid) {
    errorMessage.textContent = 'Success!';
    errorMessage.style.color = '#37b24d';
  }
  return shopperFormValid;
}

const checkValidity = function () {
  if (
    this.validity.patternMismatch ||
    this.validity.typeMismatch ||
    this.validity.valueMissing ||
    this.validity.tooShort
  ) {
    this.style.borderColor = '#f03e3e';
    this.setCustomValidity(
      `Please check the ${this.getAttribute(
        'name'
      )} field. Format must match the example given`
    );
    this.reportValidity();
  } else {
    this.style.borderColor = '#37b24d';
    this.setCustomValidity('');
    return this.reportValidity();
  }
};

input.addEventListener('input', checkValidity.bind(input));

const processShopperFormData = function (e) {
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

shopperForm.addEventListener('submit', processShopperFormData);
