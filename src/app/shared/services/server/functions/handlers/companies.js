const { db } = require('../util/admin');
const { validateNewDepartment } = require('../util/validators');

// Get all
exports.getAllCompanies = (req, res) => {
    db
    .collection('companies')
    .get()
    .then(data => {
        let companies = [];
        data.forEach(doc => {
            companies.push({
                companyId: doc.id,
                name: doc.data().name,
                description: doc.data().description,   
            });
        })
        return res.json(companies);
    })
    .catch((err) => console.error(err));
};