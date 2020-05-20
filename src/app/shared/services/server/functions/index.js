const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin');

const { getAllDepartments, postOneDepartment, getDepartment, deleteDepartment } = require('./handlers/departments');
const { signup, login, uploadImage, addUserDetails, getUserDetails, createUser } = require('./handlers/users');

//Department routes
app.get('/departments', FBAuth, getAllDepartments);
app.post('/department', FBAuth, postOneDepartment);
app.get('/department/:departmentId', FBAuth, getDepartment);
app.delete('/department/:departmentsId', FBAuth, deleteDepartment);

//User routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user', FBAuth, createUser);
app.post('/user/image', FBAuth, uploadImage);
app.post('/userUpdate', FBAuth, addUserDetails);
app.get('/user/:handle', FBAuth, getUserDetails);

exports.api = functions.region('europe-west1').https.onRequest(app);

// Create parentId for a created department
exports.createParentIdOnDepartment = functions.region('europe-west1').firestore.document('departments/{id}')
    .onCreate((snapshot, context) => {
        return db.collection('departments').get()
            .then(data => {
                data.forEach(doc => {
                    let updatedDepartment = {};
                    if(doc.data().type === snapshot.data().type && parseInt(doc.data().level) === parseInt(snapshot.data().level) - 1){
                        updatedDepartment = {
                            ...snapshot.data(),
                            parentId: doc.id
                        }
                        db.doc(`departments/${snapshot.id}`).update(updatedDepartment);                       
                    }
                })
            })
            .catch(err => {
                console.error(err);
            })
    })

// Create a new type if a created department has a new type
exports.createTypeOnDepartment = functions.region('europe-west1').firestore.document('departments/{id}')
.onCreate((snapshot, context) => {
    const departmentId = context.params.id;
    let flag = false;
    return db.collection('types').get()
        .then(types => {
            types.forEach(type => {
                if(type.data().name === snapshot.data().type) {
                    flag = true;
                }
            })
            return db.doc(`/departments/${departmentId}`).get();
        }) 
        .then(doc => {
            if(!flag){
                const newType = {
                    name: doc.data().type,
                    description: ""
                }
                return db.collection('types').add(newType);
            }
            return;
        })
        .then(() => {
            return;
        })
        .catch(err => {
            console.error(err);
        })
})   