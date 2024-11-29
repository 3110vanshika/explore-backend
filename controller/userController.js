const multer = require('multer')
const path = require('path')
const { v4 : uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const createToken = require('../functions/createToken')

// Set up Multer storage and file checking
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only!"));
  }
}

// Init Multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

const createUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const created_by = uuidv4();
    const image = req.file ? `uploads/${req.file.filename}` : null;

    // Check if user with the same email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw Error("User already registered, please login")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      created_by,
      fullname,
      email,
      password: hashedPassword,
      image,
    });

    await user.save();
    res.status(200).json({
      code: 200,
      data: user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({code:400,
      message: error?.message
    });
  }
};

// Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req?.body;

    // Validation
    if(!email) throw Error("Email is required")
    if(!password) throw Error("Password is required")

    // Check if the user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      throw new Error("User not found. Please register first.");
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials. Please check your email and password.");
    }
    const user = existingUser.toObject();
    delete user.password;

    const token = await createToken(user);
    res.status(200).json({
      code: 200,
      token,
      user
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error?.message 
    });
  }
};

module.exports = {createUser, upload, userLogin}