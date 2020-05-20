const { db } = require('../util/admin');
const { validateNewDepartment } = require('../util/validators');

// Get all
exports.getAllDepartments = (req, res) => {
    db
    .collection('departments')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let departments = [];
        data.forEach(doc => {
            departments.push({
                departmentId: doc.id,
                name: doc.data().name,
                level: doc.data().level,
                createdAt: doc.data().createdAt,
                parentId: doc.data().parentId,
                type: doc.data().type,
                description: doc.data().description
            });
        })
        return res.json(departments);
    })
    .catch((err) => console.error(err));
};

// Create department
exports.postOneDepartment = (req, res) => {
    if (req.method !== "POST") {
        return res.status(400).json({ error: 'Method not allowed' });
    }

    const newDepartment = {
        name: req.body.name,
        level: req.body.level,
        createdAt: new Date().toISOString(),
        type: req.body.type,
        parentId : null,
        description: req.body.description
    };

    const {valid, errors } = validateNewDepartment(newDepartment);

    if(!valid) return res.status(400).json(errors);

    db.collection('departments').get()
    .then(docs => {
        const names = [];
        docs.forEach(doc => {
            if(doc.data().name === newDepartment.name){
                names.push(newDepartment.name);
            }
        })
        if(names.length !== 0){
           return res.status(400).json({ error: 'Department is existed!' });
        }
        return db.collection('departments').add(newDepartment);
    })
    .then((doc) => {
        res.status(201).json({ message: 'Create successfully!'});
    })
    .catch(err => {
        res.status(500).json({ error: 'something went wrong' });
        console.error(err);
    })
        
};

// Get department
exports.getDepartment = (req, res) => {
    let departmentData = {};
    db.doc(`/departments/${req.params.departmentId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(400).json({ error: 'Department not found' });
            }
            departmentData = doc.data();
            departmentData.departmentId = doc.id;
            return db.collection('users').get();
        })
        .then(data => {
            departmentData.users = [];
            data.forEach(doc => {
                if(doc.data().department === departmentData.name) {
                    departmentData.users.push({
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
                    })
                }
            });

            return res.status(200).json(departmentData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err });
        })
};

// Delete department
exports.deleteDepartment = (req, res) => {
    let department = {};
    let flag = false;
    const document = db.doc(`/departments/${req.params.departmentId}`);
    document.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Department not found' });
            }
            department = doc.data();
            return db.collection('users').get();
        })
        .then(users => {
            users.forEach(user => {
                if(user.data().department === department.name){
                    flag = true;
                }
            })
            if(flag){
                return res.status(404).json({ error: 'Department has users' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Department deleted successfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err });
        })
};