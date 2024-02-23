document.addEventListener('DOMContentLoaded', function() {
    const makeDropdown = document.getElementById('makeDropdown');
    const modelDropdown = document.getElementById('modelDropdown');
    const yearDropdown = document.getElementById('yearDropdown');
    const carForm = document.getElementById('carForm');

    makeDropdown.addEventListener('change', function() {
        const selectedMake = this.value;
        fetch(`/models?make=${selectedMake}`)
            .then(response => response.json())
            .then(models => {
                modelDropdown.innerHTML = '<option value="">Select Model</option>';
                models.forEach(car => {
                    const option = new Option(car.model, car.model);
                    option.dataset.carId = car._id; 
                    modelDropdown.append(option);
                });
                modelDropdown.disabled = false;
            })
            .catch(error => console.error('Error:', error));
    });

    modelDropdown.addEventListener('change', function() {
        const selectedMake = makeDropdown.value;
        const selectedModel = this.value;
        fetch(`/years?make=${selectedMake}&model=${selectedModel}`)
            .then(response => response.json())
            .then(years => {
                yearDropdown.innerHTML = '<option value="">Select Year</option>';
                years.forEach(year => {
                    yearDropdown.append(new Option(year, year));
                });
                yearDropdown.disabled = false;
            })
            .catch(error => console.error('Error:', error));
    });

carForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const selectedCarId = modelDropdown.options[modelDropdown.selectedIndex].dataset.carId;
    if(selectedCarId) {
        const confirmationMessage = document.getElementById('confirmationMessage');
        if (confirmationMessage) {
            confirmationMessage.style.display = 'block';
            setTimeout(() => {
                confirmationMessage.style.display = 'none';
            }, 10000); //timeout
        }
        console.log("Form submitted for car ID:", selectedCarId);
        window.location.href = `/reviews/${selectedCarId}`;
    } else {
        alert("Please select a valid model.");
    }
});

});