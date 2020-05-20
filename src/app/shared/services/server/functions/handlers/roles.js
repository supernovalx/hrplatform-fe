const { db } = require('../util/admin');

// Get all
exports.getAllRoles = (req, res) => {
    db
    .collection('roles')
    .get()
    .then(data => {
        let roles = [];
        data.forEach(doc => {
            roles.push({
                roleId: doc.id,
                name: doc.data().name,
                description: doc.data().description,   
            });
        })
        return res.json(roles);
    })
    .catch((err) => console.error(err));
};