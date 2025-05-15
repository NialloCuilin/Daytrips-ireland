const cloudinary = require('../utils/cloudinary');

const uploadPhoto = async (req, res) => {
  try {
    const fileStr = req.body.data;

    console.log('Received file string:', fileStr.slice(0, 100)); //the first 100 chars

    const uploadedResponse = await cloudinary.uploader.upload(fileStr);

    res.json({ url: uploadedResponse.secure_url });
  } catch (err) {
    console.error("Error uploading to Cloudinary:", err.response?.data || err.message || err);
    res.status(500).json({ message: 'Something went wrong uploading the image.', error: err.message });
  }
};

module.exports = { uploadPhoto };