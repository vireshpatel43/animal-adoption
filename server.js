const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const session = require('express-session');
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'random',
    resave: false,
    saveUninitialized: false
}));

function checkAuth(req, res, next) {
    if (req.session.isAuthenticated) {
        res.locals.isAuthenticated = true;
        res.locals.username = req.session.username;
    } else {
        res.locals.isAuthenticated = false;
    }
    next();
}


app.use(checkAuth);

app.get('/', (req, res) => {
    res.render('layout', {
        pageTitle: 'Home',
        content: 'home',
        currentTab: 'home'
    });
});

app.get('/create-account', (req, res) => {
    res.render('layout', {
        pageTitle: 'Create Account',
        content: 'create-account',
        currentTab: 'create-account'
    })
});

app.get('/browse-pets', (req, res) => {
    res.render('layout', {
        pageTitle: 'Browse Pets',
        content: 'browse-pets',
        currentTab: 'browse-pets'
    });
});

app.get('/find-a-pet', (req, res) => {
    res.render('layout', {
        pageTitle: 'Find a Pet',
        content: 'find-a-pet',
        currentTab: 'find-a-pet'
    });
});

app.get('/dog-care', (req, res) => {
    res.render('layout', {
        pageTitle: 'Dog Care',
        content: 'dog-care',
        currentTab: 'dog-care'
    });
});

app.get('/cat-care', (req, res) => {
    res.render('layout', {
        pageTitle: 'Cat Care',
        content: 'cat-care',
        currentTab: 'cat-care'
    });
});

app.get('/give-away-pet', (req, res) => {
    if (req.session.isAuthenticated) {
        res.render('layout', {
            pageTitle: 'Give Away Pet',
            content: 'give-away-pet',
            currentTab: 'give-away-pet'
        });
    } else {
        res.redirect('/not-logged-in');
    }
});

app.get('/not-logged-in', (req, res) => {
    res.render('layout', {
        pageTitle: 'Please Login',
        content: 'not-logged-in',
        currentTab: ''
    })
});

app.get('/contact-us', (req, res) => {
    res.render('layout', {
        pageTitle: 'Contact Us',
        content: 'contact-us',
        currentTab: 'contact-us'
    });
});

app.get('/privacy-policy', (req, res) => {
    res.render('layout', {
        pageTitle: 'Privacy Policy',
        content: 'privacy-policy',
        currentTab: ''
    });
});

app.get('/credits', (req, res) => {
    res.render('layout', {
        pageTitle: 'Credits',
        content: 'credits',
        currentTab: ''
    });
});

app.get('/login-page', (req, res) => {
    res.render('layout', {
        pageTitle: 'Login Page',
        content: 'login-page',
        currentTab: '',
        errorMessage: ''
    });
});

app.post('/add-account', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const filename = path.join(__dirname, 'userfile.txt');

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const lines = data.split('\n');

        // Check if the username already exists in the file
        for (const line of lines) {
            const [fileUsername, filePassword] = line.split(':');

            if (fileUsername === username) {
                // Username already exists
                return res.render('layout', {
                    pageTitle: 'User Already Exists',
                    content: 'username-taken',
                    currentTab: ''
                });
            }
        }

        // If username does not exist, append to the file
        const userData = `${username}:${password}\n`;
        fs.appendFile(filename, userData, (appendErr) => {
            if (appendErr) {
                console.error('Error appending to file:', appendErr);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Log the user in 
            req.session.isAuthenticated = true;
            req.session.username = username;

            // Account created successfully
            res.render('layout', {
                pageTitle: 'Account Created',
                content: 'confirmation-page',
                currentTab: '',
                username: username
            });
        });
    });
});

function readUserCredentials() {
    const filename = path.join(__dirname, 'userfile.txt');
    const userData = fs.readFileSync(filename, 'utf8');
    const users = {};

    userData.split('\n').forEach((line) => {
        const [username, password] = line.trim().split(':');
        if (username && password) {
            users[username] = password;
        }
    });

    return users;
}

// TODO: Add a confirmation screen for logins
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUserCredentials();
    // if the user exists in list, and the password of that matching user is equal
    if (users[username] && users[username] === password) {
        req.session.isAuthenticated = true;
        req.session.username = username;
        res.redirect('/login-confirmation')
    } else {
        res.render('layout', {
            pageTitle: 'Login',
            content: 'login-page',
            currentTab: 'Login',
            errorMessage: 'Invalid credentials. Try again or create an account.'
        });
    }
});

app.get('/login-confirmation', (req, res) => {
    const username = req.session.username;
    res.render('layout', {
        pageTitle: 'Login Success',
        content: 'login-confirmation',
        currentTab: '',
        username: username
    });
});

app.get('/logout-page', (req, res) => {
    res.render('layout', {
        pageTitle: 'Logout',
        content: 'logout-page',
        currentTab: ''
    })
})


app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/logout-page')
    });
});

let petCounter = 0;

app.post('/add-pet', (req, res) => {
    const filename = path.join(__dirname, 'pets.txt');

    const { 'pet-type': petType, 'age-category': ageCategory, 'cat-breed': catBreed, 'dog-breed': dogBreed, 'pet-gender': petGender, 'gets-along-with': getsAlongWith, 'more-pet-info': morePetInfo, 'owner-name': ownerName, 'owner-email': ownerEmail } = req.body;

    // Determine the breed based on pet type
    const breed = (petType === 'Cat' ? catBreed : dogBreed);

    const petData = `${++petCounter}:${req.session.username}:${petType}:${ageCategory}:${petGender}:${breed}:${getsAlongWith}:${morePetInfo}:${ownerName}:${ownerEmail}\n`;

    fs.appendFile(filename, petData, (appendErr) => {
        if (appendErr) {
            console.error('Error appending to file:', appendErr);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.render('layout', {
            pageTitle: 'Pet Added',
            content: 'pet-added',
            currentTab: '',
        });
    });
});

// Extract the pets that are in the txt file
function readPetCredentials() {
    const filename = path.join(__dirname, 'pets.txt');
    const petData = fs.readFileSync(filename, 'utf8');
    const pets = [];
    try {

        const data = fs.readFileSync(filename, 'utf-8');

        const lines = data.split('\n');

        lines.forEach((line) => {
            if (line.trim() !== '') {

                const [petId, username, petType, ageCategory, petGender, breed, getsAlongWith, morePetInfo, ownerName, ownerEmail] = line.split(':');


                // extract only the properties to be displayed
                const pet = {
                    type: petType,
                    age: ageCategory,
                    gender: petGender,
                    breed: breed,
                    getsAlongWith: getsAlongWith,
                    morePetInfo: morePetInfo,
                    ownerName: ownerName,
                    ownerEmail: ownerEmail
                };

                pets.push(pet);
            } else {
                console.log('There is an error with the data');
            }
        });

        return pets;
    } catch (err) {
        console.error('Error reading file:', err);
    }
}

app.post('/find-pets', (req, res) => {
    const pets = readPetCredentials();

    let { 'pet-type': petType, 'age-category': ageCategory, 'dog-breed': dogBreeds, 'cat-breed': catBreeds, 'pet-gender': petGender, 'get-along-with': getAlongWith } = req.body;

    const breedSelection = (petType === 'Dog') ? dogBreeds : catBreeds;

    const filteredPets = pets.filter(pet => {

        if (!pet || !pet.type || !pet.age || !pet.breed || !pet.gender || !pet.getsAlongWith) {
            return false;
        }

        if (petType.toLowerCase() !== "doesn't matter" && pet.type.toLowerCase() !== petType.toLowerCase()) {
            return false;
        }

        if (ageCategory.toLowerCase() !== "doesn't matter" && pet.age !== ageCategory) {
            return false;
        }

        if (petGender.toLowerCase() !== "doesn't matter" && pet.gender.toLowerCase() !== petGender.toLowerCase()) {
            return false;
        }

        if (!Array.isArray(getAlongWith)) {
            getAlongWith = [getAlongWith];
        }
        
        const petCompatible = getAlongWith.every(category => pet.getsAlongWith.includes(category));

        if (!petCompatible) {
            return false;
        }

        if (!breedSelection.includes("Doesn't Matter") && !breedSelection.includes(pet.breed)) {
            return false;
        }

        return true;
    });

    res.render('layout', {
        pageTitle: 'Pet Listings',
        content: 'find-pets',
        currentTab: '',
        filteredPets: filteredPets
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});