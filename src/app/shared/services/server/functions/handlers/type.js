const { db } = require('../util/admin');

// Get all
exports.getAllTypes = (req, res) => {
    db
    .collection('types')
    .get()
    .then(data => {
        let types = [];
        data.forEach(doc => {
            types.push({
                typeId: doc.id,
                name: doc.data().name,
                description: doc.data().description,   
            });
        })
        return res.json(types);
    })
    .catch((err) => console.error(err));
};