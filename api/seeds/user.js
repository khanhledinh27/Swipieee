import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Data options
const HOBBY_OPTIONS = [
  "Reading", "Sports", "Gaming", "Cooking", "Traveling",
  "Photography", "Music", "Art", "Dancing", "Hiking",
  "Cycling", "Swimming", "Yoga", "Movies", "Writing",
  "Gardening", "Fishing", "Chess", "Programming", "Shopping"
];

const JOB_OPTIONS = [
  "Student", "Engineer", "Doctor", "Teacher", "Artist", 
  "Developer", "Designer", "Manager", "Other"
];

const RELIGION_OPTIONS = [
  "Christianity", "Islam", "Hinduism", "Buddhism", 
  "Judaism", "Atheism", "Other"
];

const HEIGHT_OPTIONS = Array.from({ length: 61 }, (_, i) => 140 + i); // 140cm to 200cm
const WEIGHT_OPTIONS = Array.from({ length: 81 }, (_, i) => 40 + i); // 40kg to 120kg

const LOCATION_OPTIONS = [
  "An Giang", "Ba Ria - Vung Tau", "Bac Giang", "Bac Kan", "Bac Lieu", "Bac Ninh",
  "Ben Tre", "Binh Dinh", "Binh Duong", "Binh Phuoc", "Binh Thuan", "Ca Mau",
  "Can Tho", "Cao Bang", "Da Nang", "Dak Lak", "Dak Nong", "Dien Bien", "Dong Nai",
  "Dong Thap", "Gia Lai", "Ha Giang", "Ha Nam", "Ha Noi", "Ha Tinh", "Hai Duong",
  "Hai Phong", "Hau Giang", "Hoa Binh", "Hung Yen", "Khanh Hoa", "Kien Giang",
  "Kon Tum", "Lai Chau", "Lam Dong", "Lang Son", "Lao Cai", "Long An", "Nam Dinh",
  "Nghe An", "Ninh Binh", "Ninh Thuan", "Phu Tho", "Phu Yen", "Quang Binh",
  "Quang Nam", "Quang Ngai", "Quang Ninh", "Quang Tri", "Soc Trang", "Son La",
  "Tay Ninh", "Thai Binh", "Thai Nguyen", "Thanh Hoa", "Thua Thien Hue", "Tien Giang",
  "Ho Chi Minh City", "Tra Vinh", "Tuyen Quang", "Vinh Long", "Vinh Phuc", "Yen Bai"
];

// Coordinates for Vietnamese locations
const VIETNAM_COORDINATES = {
  "An Giang": [105.1667, 10.5216],
  "Ba Ria - Vung Tau": [107.2428, 10.5417],
  "Bac Giang": [106.1978, 21.2810],
  "Bac Kan": [105.8348, 22.1470],
  "Bac Lieu": [105.4681, 9.2941],
  "Bac Ninh": [106.0763, 21.1861],
  "Ben Tre": [106.3756, 10.2434],
  "Binh Dinh": [109.2191, 13.7820],
  "Binh Duong": [106.6520, 10.9804],
  "Binh Phuoc": [106.8901, 11.7512],
  "Binh Thuan": [108.1021, 11.0904],
  "Ca Mau": [105.1500, 9.1768],
  "Can Tho": [105.7878, 10.0452],
  "Cao Bang": [106.2522, 22.6657],
  "Da Nang": [108.2208, 16.0544],
  "Dak Lak": [108.0500, 12.7100],
  "Dak Nong": [107.6886, 12.2644],
  "Dien Bien": [103.0230, 21.3860],
  "Dong Nai": [106.8246, 10.9453],
  "Dong Thap": [105.6413, 10.4930],
  "Gia Lai": [108.0000, 13.9833],
  "Ha Giang": [104.9836, 22.8233],
  "Ha Nam": [105.9122, 20.5836],
  "Ha Noi": [105.8342, 21.0278],
  "Ha Tinh": [105.9057, 18.3559],
  "Hai Duong": [106.3160, 20.9400],
  "Hai Phong": [106.6822, 20.8449],
  "Hau Giang": [105.6413, 9.7579],
  "Hoa Binh": [105.3131, 20.8171],
  "Hung Yen": [106.0511, 20.6464],
  "Khanh Hoa": [109.1967, 12.2585],
  "Kien Giang": [105.0844, 9.8247],
  "Kon Tum": [107.9969, 14.3490],
  "Lai Chau": [103.4581, 22.3862],
  "Lam Dong": [108.4384, 11.5753],
  "Lang Son": [106.7659, 21.8537],
  "Lao Cai": [104.0089, 22.4800],
  "Long An": [106.4170, 10.5430],
  "Nam Dinh": [106.1621, 20.4388],
  "Nghe An": [104.9790, 19.2342],
  "Ninh Binh": [105.9750, 20.2500],
  "Ninh Thuan": [108.9860, 11.6739],
  "Phu Tho": [105.2300, 21.3450],
  "Phu Yen": [109.1191, 13.0882],
  "Quang Binh": [106.6042, 17.4689],
  "Quang Nam": [108.2378, 15.5394],
  "Quang Ngai": [108.8044, 15.1205],
  "Quang Ninh": [107.3337, 21.0064],
  "Quang Tri": [107.1897, 16.8163],
  "Soc Trang": [105.9800, 9.6031],
  "Son La": [103.9188, 21.3256],
  "Tay Ninh": [106.1106, 11.3555],
  "Thai Binh": [106.3361, 20.4463],
  "Thai Nguyen": [105.8442, 21.5942],
  "Thanh Hoa": [105.7769, 19.8076],
  "Thua Thien Hue": [107.5847, 16.4637],
  "Tien Giang": [106.3439, 10.4491],
  "Ho Chi Minh City": [106.6297, 10.8231],
  "Tra Vinh": [106.3421, 9.8127],
  "Tuyen Quang": [105.2181, 21.8230],
  "Vinh Long": [106.0173, 10.2538],
  "Vinh Phuc": [105.5946, 21.3089],
  "Yen Bai": [104.8700, 21.7050],
  "Default": [108.2772, 14.0583]
};

const maleNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas"];
const femaleNames = ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Nancy", "Lisa"];
const genderPreferences = ["male", "female", "both"];

const bioDescriptors = [
  "Coffee addict", "Cat lover", "Dog person", "Foodie", "Gym rat",
  "Bookworm", "Movie buff", "Music lover", "Travel junkie", "Beach bum",
  "City slicker", "Outdoor enthusiast", "Netflix binger", "Yoga enthusiast",
  "Craft beer connoisseur", "Sushi fanatic", "Adventure seeker", "Night owl",
  "Early bird", "Aspiring chef"
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