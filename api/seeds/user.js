import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Data options
const HOBBY_OPTIONS = [
  "Đọc sách", "Thể thao", "Chơi game", "Nấu ăn", "Du lịch",
"Nhiếp ảnh", "Âm nhạc", "Nghệ thuật", "Khiêu vũ", "Đi bộ đường dài",
"Đạp xe", "Bơi lội", "Yoga", "Phim ảnh", "Viết lách",
"Làm vườn", "Câu cá", "Cờ vua", "Lập trình", "Mua sắm"
];

const JOB_OPTIONS = [
   "Sinh viên", "Kỹ sư", "Bác sĩ", "Giáo viên", "Nghệ sĩ", "Lập trình viên", "Nhà thiết kế", "Quản lý", "Khác"
];

const RELIGION_OPTIONS = [
  "Thiên Chúa giáo", "Hồi giáo", "Ấn Độ giáo", "Phật giáo", "Do Thái giáo", "Vô thần", "Khác"
];

const HEIGHT_OPTIONS = Array.from({ length: 61 }, (_, i) => 140 + i); // 140cm to 200cm
const WEIGHT_OPTIONS = Array.from({ length: 81 }, (_, i) => 40 + i); // 40kg to 120kg

const LOCATION_OPTIONS = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", 
"Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", 
"Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", 
"Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", 
"Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", 
"Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", 
"Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", 
"Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", 
"Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", 
"Thành phố Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

// Coordinates for Vietnamese locations
const VIETNAM_COORDINATES = {
  "An Giang": [105.1667, 10.5216],
  "Bà Rịa - Vũng Tàu": [107.2428, 10.5417],
  "Bắc Giang": [106.1978, 21.2810],
  "Bắc Kạn": [105.8348, 22.1470],
  "Bạc Liêu": [105.4681, 9.2941],
  "Bắc Ninh": [106.0763, 21.1861],
  "Bến Tre": [106.3756, 10.2434],
  "Bình Định": [109.2191, 13.7820],
  "Bình Dương": [106.6520, 10.9804],
  "Bình Phước": [106.8901, 11.7512],
  "Bình Thuận": [108.1021, 11.0904],
  "Cà Mau": [105.1500, 9.1768],
  "Cần Thơ": [105.7878, 10.0452],
  "Cao Bằng": [106.2522, 22.6657],
  "Đà Nẵng": [108.2208, 16.0544],
  "Đắk Lắk": [108.0500, 12.7100],
  "Đắk Nông": [107.6886, 12.2644],
  "Điện Biên": [103.0230, 21.3860],
  "Đồng Nai": [106.8246, 10.9453],
  "Đồng Tháp": [105.6413, 10.4930],
  "Gia Lai": [108.0000, 13.9833],
  "Hà Giang": [104.9836, 22.8233],
  "Hà Nam": [105.9122, 20.5836],
  "Hà Nội": [105.8342, 21.0278],
  "Hà Tĩnh": [105.9057, 18.3559],
  "Hải Dương": [106.3160, 20.9400],
  "Hải Phòng": [106.6822, 20.8449],
  "Hậu Giang": [105.6413, 9.7579],
  "Hòa Bình": [105.3131, 20.8171],
  "Hưng Yên": [106.0511, 20.6464],
  "Khánh Hòa": [109.1967, 12.2585],
  "Kiên Giang": [105.0844, 9.8247],
  "Kon Tum": [107.9969, 14.3490],
  "Lai Châu": [103.4581, 22.3862],
  "Lâm Đồng": [108.4384, 11.5753],
  "Lạng Sơn": [106.7659, 21.8537],
  "Lào Cai": [104.0089, 22.4800],
  "Long An": [106.4170, 10.5430],
  "Nam Định": [106.1621, 20.4388],
  "Nghệ An": [104.9790, 19.2342],
  "Ninh Bình": [105.9750, 20.2500],
  "Ninh Thuận": [108.9860, 11.6739],
  "Phú Thọ": [105.2300, 21.3450],
  "Phú Yên": [109.1191, 13.0882],
  "Quảng Bình": [106.6042, 17.4689],
  "Quảng Nam": [108.2378, 15.5394],
  "Quảng Ngãi": [108.8044, 15.1205],
  "Quảng Ninh": [107.3337, 21.0064],
  "Quảng Trị": [107.1897, 16.8163],
  "Sóc Trăng": [105.9800, 9.6031],
  "Sơn La": [103.9188, 21.3256],
  "Tây Ninh": [106.1106, 11.3555],
  "Thái Bình": [106.3361, 20.4463],
  "Thái Nguyên": [105.8442, 21.5942],
  "Thanh Hóa": [105.7769, 19.8076],
  "Thừa Thiên Huế": [107.5847, 16.4637],
  "Tiền Giang": [106.3439, 10.4491],
  "Thành phố Hồ Chí Minh": [106.6297, 10.8231],
  "Trà Vinh": [106.3421, 9.8127],
  "Tuyên Quang": [105.2181, 21.8230],
  "Vĩnh Long": [106.0173, 10.2538],
  "Vĩnh Phúc": [105.5946, 21.3089],
  "Yên Bái": [104.8700, 21.7050],
  "Default": [108.2772, 14.0583]
};

const maleNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas"];
const femaleNames = ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Nancy", "Lisa"];
const genderPreferences = ["male", "female", "both"];

const bioDescriptors = [
  "Yêu cà phê", "Yêu mèo", "Thích chó", "Tín đồ ẩm thực", "Gym",
  "Mọt sách", "Mê phim", "Yêu âm nhạc", "Đam mê du lịch", "Thích biển",
  "Người thành thị", "Yêu thiên nhiên", "Cày Netflix", "Đam mê yoga",
  "Sành bia", "Fan sushi", "Thích phiêu lưu", "Cú đêm",
  "Thích dậy sớm", "Đầu bếp tương lai"
];

const generateBio = () => {
  const descriptors = [...bioDescriptors]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  return descriptors.join(" | ");
};

const generateRandomHobbies = () => {
  const count = Math.floor(Math.random() * 2) + 3;
  return [...HOBBY_OPTIONS]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
};

const getRandomLocation = () => {
  const city = LOCATION_OPTIONS[Math.floor(Math.random() * LOCATION_OPTIONS.length)];
  return {
    type: "Point",
    coordinates: VIETNAM_COORDINATES[city] || VIETNAM_COORDINATES["Default"],
    address: city
  };
};

const generateRandomUser = (gender, index) => {
  const names = gender === "male" ? maleNames : femaleNames;
  const name = names[index % names.length];
  const age = Math.floor(Math.random() * (45 - 21 + 1) + 21);
  const today = new Date();
  const dob = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
  
  // Generate realistic height first (in cm)
  const height = gender === "male" 
    ? Math.floor(Math.random() * (190 - 165 + 1) + 165) // Male: 165-190cm
    : Math.floor(Math.random() * (180 - 155 + 1) + 155); // Female: 155-180cm

  // Calculate weight based on BMI (18.5-24.9 healthy range)
  const minBMI = 18.5;
  const maxBMI = 24.9;
  const heightInMeters = height / 100;
  const minWeight = Math.round(minBMI * heightInMeters * heightInMeters);
  const maxWeight = Math.round(maxBMI * heightInMeters * heightInMeters);
  const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1) + minWeight);

  return {
    name,
    email: `${name.toLowerCase()}${index}@example.com`,
    password: bcrypt.hashSync("password123", 10),
    dateOfBirth: dob,
    bio: generateBio(),
    profilePicture: `/${gender}/${(index % 10) + 1}.jpg`,
    photoAlbum: Array(3).fill().map((_, i) => 
      `/${gender}/${((index + i) % 10) + 1}.jpg`
    ),
    gender,
    genderPreference: genderPreferences[Math.floor(Math.random() * genderPreferences.length)],
    weight,
    height,
    job: JOB_OPTIONS[Math.floor(Math.random() * JOB_OPTIONS.length)],
    religion: RELIGION_OPTIONS[Math.floor(Math.random() * RELIGION_OPTIONS.length)],
    location: getRandomLocation(),
    hobbies: generateRandomHobbies(),
    verified: Math.random() > 0.2,
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
  };
};

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});

    const maleUsers = Array(10).fill().map((_, i) => generateRandomUser("male", i));
    const femaleUsers = Array(10).fill().map((_, i) => generateRandomUser("female", i + 10));

    const allUsers = [...maleUsers, ...femaleUsers];

    await User.insertMany(allUsers);

    console.log(`Database seeded successfully with ${allUsers.length} users`);
    console.log(`Sample user email: ${allUsers[0].email} (password: password123)`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedUsers();