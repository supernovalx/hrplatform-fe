const { admin, db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails, reduceCreateUser } = require('../util/validators');

// Sign up user
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    };

    const {valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';

    //TODO: validate data
    let token, userId;
    db.collection('users').where('email', '==', newUser.email).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ error: 'This email is already existed' });
            } else {
                return firebase
                            .auth()
                            .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId
            };
            return db.doc(`/users/${userId}`).set(userCredentials);
        })
        .then(()=> {
            return res.status(201).json({ token });
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ error: 'Email is already used' });
            } else {
                return res.status(500).json({ error: 'Something went wrong, please try again' });
            }
        })
};

// Sign in user
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const {valid, errors } = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
            // auth/wrong-password
            // auth/user-not-user
            return res.status(403).json({ message: 'Wrong credentials, please try again' });

        })
};

// Create user
exports.createUser = (req, res) => {
    let {userData, valid, errorsUser} = reduceCreateUser(req.body);

    if(!valid) return res.status(400).json(errorsUser.error);

    const noImg = 'no-img.png';

    //TODO: validate data
    let token, userId;
    db.collection('users').where('email', '==', userData.email).get()
        .then(doc => {
            const users = [];
            doc.forEach(user => {
                users.push(user.data())
            })
            if(users.length !== 0){
                return res.status(400).json({ error: 'This email is already existed' });
            } else {
                return firebase
                            .auth()
                            .createUserWithEmailAndPassword(userData.email, userData.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                ...userData,
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId
            };
            return db.doc(`users/${userId}`).set(userCredentials);
        })
        .then(() => {
            return db.collection('roles').where('name', '==', userData.role).get();   
        })
        .then(data => {
            const roles = [];
            data.forEach(role => {
                roles.push(role.data().name);
            })
            if(roles.length === 0){
                const newRole = {
                    name: userData.role,
                    description: ""
                }
                db.collection('roles').add(newRole);
            }
            return db.collection('companies').where('name', '==', userData.company).get();
        })
        .then(data => {
            const companies = [];
            data.forEach(company => {
                companies.push(company.data().name);
            })
            if(companies.length === 0){
                const newCompany = {
                    name: userData.company,
                    description: ""
                }
                db.collection('companies').add(newCompany);
            }
            return;
        })
        .then(() => {
            return res.status(201).json({ message: 'Add new user successfully!', token });
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email is already used' });
            } else {
                return res.status(500).json({ general: 'Something went wrong, please try again', error: err });
            }
        })
};

// Add user details
exports.addUserDetails = (req, res) => {
    let {valid, errors, userDetails} = reduceUserDetails(req.body);

    if(!valid) return res.status(400).json(errors);

    db.doc(`/users/${req.user.uid}`).update(userDetails)
        .then(() => {
            return db.collection('roles').where('name', '==', userDetails.role).get();   
        })
        .then(data => {
            const roles = [];
            data.forEach(role => {
                roles.push(role.data().name);
            })
            if(roles.length === 0){
                const newRole = {
                    name: userDetails.role,
                    description: ""
                }
                db.collection('roles').add(newRole);
            }
            return db.collection('companies').where('name', '==', userDetails.company).get();
        })
        .then(data => {
            const companies = [];
            data.forEach(company => {
                companies.push(company.data().name);
            })
            if(companies.length === 0){
                const newCompany = {
                    name: userDetails.company,
                    description: ""
                }
                db.collection('companies').add(newCompany);
            }
            return;
        })
        .then(() => {
            return res.status(201).json({ message: 'Details updated successfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err });
        })
};

exports.getAllUsers = (req, res) => {
    db
    .collection('users')
    .get()
    .then(data => {
        let users = [];
        data.forEach(doc => {
            users.push({
                userId: doc.id,
                email: doc.data().email,
                password: doc.data().password,
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
                telephone: doc.data().telephone,
                address: doc.data().address,
                department: doc.data().department,
                role: doc.data().role,
                DoB: doc.data().DoB,
                company: doc.data().company,
            });
        })
        return res.json(users);
    })
    .catch((err) => console.error(err));
};

// Get any user's details
exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.userId}`).get()
        .then(doc => {
            if(doc.exists){
                userData.user = doc.data();
                return db.collection('departments').where('name', '==', userData.user.department).get();
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        })
        .then(doc => {
            if(doc.exists){
                userData.department = {
                    name: doc.data().name,
                    createdAt: doc.data().createdAt,
                    level: doc.data().level,
                    description: doc.data().userImage,
                    departmentId: doc.id
                }
            } else {
                userData.department = { department: "Not found department" }
            }
           
            return db.collection('roles').where('name', '==', userData.user.role).get();        
        })
        .then(doc => {
            if(doc.exists){
                userData.role = {
                    name: doc.data().name,
                    description: doc.data().description
                }
            } else {
                userData.role = { department: "Not found role" }
            }           
            return db.collection('companies').where('name', '==', userData.user.company).get();
        })
        .then(doc => {
            if(doc.exists){
                userData.company = {
                    name: doc.data().name,
                    description: doc.data().description
                }
            } else {
                userData.company = { department: "Not found company" }
            }
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err });
        })
};

// Upload an inmage for user
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted' });
        }
        // my.image.png
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        // 1234248928342.png
        imageFileName = `${Math.round(Math.random()*1000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl});
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
    });
    busboy.end(req.rawBody);
};