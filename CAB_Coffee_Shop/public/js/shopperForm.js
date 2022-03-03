const shopperForm = document.querySelector('.shopper_form');
const errorMessage = document.getElementById('message');
const input = document.querySelectorAll('input');

const validateShopperForm = function () {
  const shopperFormValid = shopperForm.checkValidity();
  if (shopperFormValid) {
    errorMessage.textContent = 'Success!';
    errorMessage.style.color = '#37b24d';
  }
  return shopperFormValid;
};

const checkValidity = function () {
  if (
    this.validity.patternMismatch ||
    this.validity.typeMismatch ||
    this.validity.valueMissing ||
    this.validity.tooShort
  ) {
    this.style.borderColor = '#f03e3e';
    if (this.validity.patternMismatch) {
      this.setCustomValidity('Input must match the provided example');
    }
    if (this.validity.typeMismatch) {
      this.setCustomValidity('Please provide a valid email');
    }
    if (this.validity.valueMissing) {
      this.setCustomValidity('Please fill out this field');
    }
    this.reportValidity();
  } else {
    this.style.borderColor = '#37b24d';
    this.setCustomValidity('');
    this.reportValidity();
  }
};

input.forEach(el => {
  el.addEventListener('input', checkValidity.bind(el));
});

const processShopperFormData = async function (e) {
  e.preventDefault();
  const isValid = validateShopperForm();
  if (isValid) {
    const captureData = {
      name: shopperForm.fullName.value,
      email: shopperForm.email.value,
      phone: shopperForm.phone?.value,
      birthday: shopperForm.birthday.value,
      streetAddress: shopperForm.streetAddress.value,
      state: shopperForm.state.value,
      zip: shopperForm.zip.value
    };
    console.log(captureData);
    try {
      const res = await fetch('http://localhost:8000/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(captureData)
      });
      // window.location.assign(`/views/index.html`);
      if (!res.ok) {
        throw new Error('Something went wrong. Please try again.');
      }
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  }
};

shopperForm.addEventListener('submit', processShopperFormData);
