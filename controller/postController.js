const multer = require('multer');
const path = require('path');
const postModel = require('../model/postModel');

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
  limits: { fileSize: 5000000 }, 
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb); 
  },
}).single("image"); 

// Create a new blog post
const createPost = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;
    // Check if required fields are provided
    if (!title) {
      throw Error("Title are required field")
    }
    if (!content) {
      throw Error("Content are required field")
    }
    if (!author) {
      throw Error("Author are required field")
    }
    if (!tags) {
      throw Error("Tags are required field")
    }

    const newPost = new postModel({
      title,
      content,
      author,   
      image,   
      tags,   
    });

    await newPost.save();
    res.status(200).json({
      code: 200,
      message: "Blog post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error.message,
    });
  }
};

// Fetch all post
const fetchAllPost = async (req, res) => {
  try {
    const allPost = await postModel.find({});
    res.status(200).json({code:200, data:allPost })
  } catch (error) {
     res.status(400).send({code:400, message:error?.message})
  }
}

// Update post
const updatePost = async (req, res) => {
  try {
    const { _id } = req.params;
    const { title, content, author, tags } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;
    console.log("Uploaded image:", image);
    const updatedPost = await postModel.findByIdAndUpdate(
      _id,
      { title, content, author, image, tags },
      { new: true } 
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({code:200, data:updatedPost});
  } catch (error) {
    res.status(400).json({ code:400, message: error?.message });
  }
};


module.exports = { createPost, upload, fetchAllPost, updatePost}
