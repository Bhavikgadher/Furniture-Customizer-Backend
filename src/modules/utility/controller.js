// src/modules/utility/controller.js
const utilityService = require('./service');

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await utilityService.uploadFile(req.file);
    res.json({ success: true, data: result, message: 'File uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile
};
