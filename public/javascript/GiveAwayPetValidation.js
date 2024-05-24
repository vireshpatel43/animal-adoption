
function validateForm() {
    let catChecked = document.forms["give-away-pet-form"]['cat'].checked;
    let dogChecked = document.forms["give-away-pet-form"]['dog'].checked;

    let maleChecked = document.forms["give-away-pet-form"]['male'].checked;
    let femaleChecked = document.forms["give-away-pet-form"]['female'].checked;

    const getAlongWithCheckboxes = document.getElementsByName('gets-along-with');
    const catBreedCheckboxes = document.getElementsByName('cat-breed');
    const dogBreedCheckboxes = document.getElementsByName('dog-breed');

    getAlongWithChecked = false;
    catBreedChecked = false;
    dogBreedChecked = false;

    if(!dogChecked && !catChecked) {
        window.alert("Please select cat or dog.");
        return false;
    } 

    let numCatChecked = 0;
    catBreedCheckboxes.forEach(checkbox => {
        if(checkbox.checked) {
            numCatChecked++;
            catBreedChecked = true;
        }
    });

    if (catChecked && numCatChecked > 1) {
        window.alert("Please choose only 1 cat breed");
        return false;
    }

    let numDogChecked = 0;

    dogBreedCheckboxes.forEach(checkbox => {
        if(checkbox.checked) {
            numDogChecked++;
            dogBreedChecked = true;
        }
    });

    if (dogChecked && numDogChecked > 1) {
        window.alert("Please choose only 1 dog breed");
        return false;
    }

    if (dogChecked && !dogBreedChecked) {
        window.alert("Please choose a dog breed.");
        return false;
    } else if (dogChecked && catBreedChecked) {
        window.alert("Please remove the cat breeds or switch type of pet.");
        return false;
    }

    if (catChecked && !catBreedChecked) {
        window.alert("Please choose a cat breed.")
        return false;
    } else if (catChecked && dogBreedChecked) {
        window.alert("Please remove the dog breeds or switch type of pet.");
        return false;
    }
    
    if (!maleChecked && !femaleChecked) {
        window.alert("Please choose a gender option.");
        return false;
    }

    getAlongWithCheckboxes.forEach(checkbox => {
        if(checkbox.checked) {
            getAlongWithChecked = true;
        }
    });

    catBreedCheckboxes.forEach(checkbox => {
        if(checkbox.checked) {
            catBreedChecked = true;
        }
    });

    if (!getAlongWithChecked) {
        window.alert("Please choose who your pet gets along with.");
        return false;
    }

    if (dogChecked && !dogBreedChecked) {
        window.alert("Please choose a dog breed.");
        return false;
    }

    let tellUsMoreBox = document.getElementById('more-pet-info');

    if (tellUsMoreBox.value === "") {
        window.alert("Please tell us something about your pet.");
        return false;
    }

    let ownerName = document.getElementById('owner-name');

    if (ownerName.value === "") {
        window.alert("Please enter your name");
        return false;
    }

    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-z0-9-]+)+$/;

    let email = document.getElementById('owner-email');

    if (!email.value.match(validEmail)) {
        window.alert("Please enter a valid email.");
        return false;
    }
}
