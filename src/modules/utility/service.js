// src/modules/utility/service.js
const uploadFile = async (file) => {
  return {
    url: `/uploads/${file.filename}`,
    filename: file.originalname,
    size: file.size
  };
};

module.exports = {
  uploadFile
};
