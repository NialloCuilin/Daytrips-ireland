const cloudinary = require('../utils/cloudinary');

// @desc Upload a profile photo
// @route POST /api/users/upload-photo
// @access Public (later we'll protect it)
const uploadPhoto = async (req, res) => {
  try {
    const fileStr = req.body.data; // expecting the image base64 string

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'ml_default', // this preset exists by default in free accounts
    });

    res.json({ url: uploadedResponse.secure_url });
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
  
    if (err.response) {
      console.error("Cloudinary Response Error:", err.response);
    }
  
    res.status(500).json({ message: 'Something went wrong uploading the image.', error: err.message });
  }
};      

module.exports = { uploadPhoto };
