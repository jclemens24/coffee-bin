const productForm = document.querySelector('.product_form');
const errorMessage = document.getElementById('message');

const validateProductForm = function () {
  const productFormValid = productForm.checkValidity();
  if (productFormValid) {
    errorMessage.textContent = 'Success!';
    errorMessage.style.color = '#37b24d';
  }
  return productFormValid;
};

export const checkProductValidity = function () {
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

export const processProductFormData = function (e) {
  e.preventDefault();
  const isValid = validateProductForm();
  if (isValid) {
    const captureData = {
      id: productForm.id.value,
      description: productForm.description.value,
      category: productForm.category.value,
      unit: productForm.unit.value,
      price: productForm.price.value,
      weight: productForm.weight?.value
    };
    console.log(captureData);
  }
};

// input.forEach(el => {
//   el.addEventListener('input', checkValidity.bind(el));
// });

// productForm?.addEventListener('submit', processProductFormData);
