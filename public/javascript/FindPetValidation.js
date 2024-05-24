
function validateForm() {
    let catChecked = document.forms["find-a-pet-form"]['cat'].checked;
    let dogChecked = document.forms["find-a-pet-form"]['dog'].checked;

    let maleChecked = document.forms["find-a-pet-form"]['male'].checked;
    let femaleChecked = document.forms["find-a-pet-form"]['female'].checked;
    let noMatterChecked = document.forms["find-a-pet-form"]['doesnt-matter-gender'].checked;

    const getAlongWithCheckboxes = document.getElementsByName('get-along-with');
    const catBreedCheckboxes = document.getElementsByName('cat-breed');
    const dogBreedCheckboxes = document.getElementsByName('dog-breed');

    getAlongWithChecked = false;
    catBreedChecked = false;
    dogBreedChecked = false;

    if(!dogChecked && !catChecked) {
        window.alert("Please select cat or dog.");
        return false;
    } 

    catBreedCheckboxes.forEach(checkbox => {
        if(checkbox.checked) {
            catBreedChecked = true;
        }
    });

    dogBreedCheckboxes.forEach(checkbox => {
        if(checkbox.checked) {
            dogBreedChecked = true;
        }
    });

    if (dogChecked && !dogBreedChecked) {
        window.alert("Please choose 1 or more dog breeds.");
        return false;
    } else if (dogChecked && catBreedChecked) {
        window.alert("Please remove the cat breeds or switch type of pet.");
        return false;
    }

    if (catChecked && !catBreedChecked) {
        window.alert("Please choose 1 or more cat breeds.");
        return false;
    } else if (catChecked && dogBreedChecked) {
        window.alert("Please remove the dog breeds or switch type of pet.");
        return false;
    }
    
    if (!maleChecked && !femaleChecked && !noMatterChecked) {
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
        window.alert("Please choose who your pet needs to get along with.");
        return false;
    }

    if (dogChecked && !dogBreedChecked) {
        window.alert("Please choose a dog breed.");
        return false;
    }
}
