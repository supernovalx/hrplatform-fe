const { db } = require('./admin');

// functions check
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
};

const isTelephone = (telephone) => {
    const regEx = /(09|01[2|6|8|9])+([0-9]{8})\b/;
    if(telephone.match(regEx)) return true;
    else return false;
};

const validateGeneralInfo = (data) => {
    let userDetails = {}
    let errors = {};

    if(!isEmpty(data.lastName.trim())) {
        userDetails.lastName = data.lastName
    } else {
        errors.error = 'Last name must not be empty';
    };
    if(!isEmpty(data.firstName.trim())) {
        userDetails.firstName = data.firstName
    } else {
        errors.error = 'First name must not be empty';
    };
    if(!isEmpty(data.DoB.trim())) {
        userDetails.DoB = data.DoB
    } else {
        errors.error = 'DoB must not be empty';
    };
    if(!isEmpty(data.address.trim())) {
        userDetails.address = data.address
    } else {
        errors.error = 'Address must not be empty';
    };
    if(!isEmpty(data.telephone.trim())) {
        userDetails.telephone = data.telephone
    } else {
        errors.error = 'Telephone must not be empty';
    };
    if(!isEmpty(data.role.trim())) {
        userDetails.role = data.role
    } else {
        errors.error = 'Role must not be empty';
    };
    if(!isEmpty(data.company.trim())) {
        userDetails.company = data.company
    } else {
        errors.error = 'Company must not be empty';
    };
    if(!isEmpty(data.department.trim())) {
        userDetails.department = data.department
    } else {
        errors.error = 'Department must not be empty';
    };
    return {userDetails, errors}
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
};

// Exports
exports.validateSignupData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = 'Must not be empty'
    } else if(!isEmail(data.email)){
        errors.email = 'Must be a valid email address'
    }

    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    if(data.password !== data.confirmPassword) errors.password = 'Password must be the same';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = 'Must not be empty';
    if(isEmpty(data.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.validateNewScream = (data) => {
    let errors = {};

    if(isEmpty(data.body)) errors.body = 'Body must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.validateNewDepartment = (data) => {
    let errors = {};

    if(isEmpty(data.name)) errors.error = 'Name must not be empty';
    if(isEmpty(data.level)) errors.error = 'Level must not be empty';
    
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.reduceUserDetails = (data) => {  
   let {errors, userDetails} = validateGeneralInfo(data);

   return {
        userDetails,
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.reduceCreateUser = (data) => {
    let userData = {};
    let errorsUser = {};

    if(isEmpty(data.email)) {
        errorsUser.email = 'Must not be empty'
    } else if(!isEmail(data.email)){
        errorsUser.email = 'Must be a valid email address'
    } else {
        userData.email = data.email;
    }

    if(isEmpty(data.password)){
        errorsUser.password = 'Must not be empty'
    } else if(data.password !== data.confirmPassword) {
        errorsUser.password = 'Password must be the same'
    } else {
        userData.password = data.password;
    }

    // Not empty
    let {errors, userDetails} = validateGeneralInfo(data);

    userData = {
        ...userData,
        userDetails
    }

    errorsUser = {
        ...errorsUser,
        errors
    }

    return {
        userData,
        errorsUser,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};