const form = document.querySelector('#shopper_form');
const nameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const birthdayInput = document.getElementById('birthday');
const streetAddress = document.getElementById('streetAddress');
const state = document.getElementById('state');
const zip = document.getElementById('zip');
const errorMessage = document.getElementById('message');

let formIsValid = false;

function validateForm() {
  formIsValid = form.checkValidity();
  if (formIsValid) {
    errorMessage.textContent = 'Success!';
    errorMessage.style.color = '#37b24d';
  }
  return formIsValid;
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
      this === emailInput
        ? 'Please enter a valid email address'
        : `Please check the ${this.getAttribute(
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

[
  nameInput,
  emailInput,
  phoneInput,
  birthdayInput,
  streetAddress,
  state,
  zip
].forEach(el => {
  el.addEventListener('input', checkValidity.bind(el));
});

const processFormData = function (e) {
  e.preventDefault();
  validateForm();
  if (formIsValid) {
    const captureData = {
      name: form.fullName.value,
      email: form.email.value,
      phone: form.phone.value,
      birthday: form.birthday.value,
      streetAddress: form.streetAddress.value,
      state: form.state.value,
      zip: form.zip.value
    };
    console.log(captureData);
    window.location.assign(`/views/index.html`);
  }
};

form.addEventListener('submit', processFormData);
