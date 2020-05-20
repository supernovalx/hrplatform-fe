// Thông tin để create new user
createNewUser = {
	"email": "test1@gmail.com",
	"password": "123456789",
	"confirmPassword": "123456789",
	"firstName": "Nguyen",
	"lastName": "Van B",
	"DoB": "29/10/1999",
	"address": "Bien Hoa Dong Nai",
	"company": "HUE",
	"department": "A",
	"role": "director",
	"telephone": "0987654321"
}

company: {
    // Được tạo ra tương ứng với mỗi khi một user profile xuất hiện tên company mới
    name,
    description
}

role: {
    // Được tạo ra tương ứng với mỗi khi một user profile xuất hiện tên role mới
    name,
    description
}

type: {
    // Được tạo ra tương ứng với mỗi khi một department xuất hiện tên type mới
    name,
    description
}

department: {
    name,
    createdAt,
    level, // phân cấp giữa các department
    parentId, // được tạo ra bằng cách so sánh type và level giữa các department
    type, // dùng để phần biệt các nhóm department
    description
}

account: {
    // Được lưu và sử dụng authentication của firebase
    email,
    password,
    confirmPassword
}

user: {
    // Mỗi khi account được tạo, một user tương ứng được tạo với 4 thông tin ban đầu
    // email, password, imageUrl (ảnh chung) và createdAt
    // Được tạo ra tương ứng với mỗi account và user vào update thông tin
    email,
    password,
    firstName,
    lastName,
    company,
    department,
    role,
    DoB,
    address,
    telephone,
    imageUrl,
    userId,
    createdAt
}
