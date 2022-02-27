const productForm = document.querySelector('.product_form');
const input = document.querySelector('input');
const errorMessage = document.getElementById('message');

function validateProductForm() {
  const productFormValid = productForm.checkValidity();
  if (productFormValid) {
    errorMessage.textContent = 'Success!';
    errorMessage.style.color = '#37b24d';
  }
  return productFormValid;
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

const processProductFormData = function (e) {
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

input.addEventListener('input', checkValidity.bind(input));

productForm?.addEventListener('submit', processProductFormData);
