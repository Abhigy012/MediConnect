import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mediconnect',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    transformation: [
      { width: 500, height: 500, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  }
});

// Configure multer for profile pictures
const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mediconnect/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 300, height: 300, crop: 'fill', gravity: 'face' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  }
});

// Configure multer for documents
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mediconnect/documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  }
});

// Configure multer for certificates
const certificateStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mediconnect/certificates',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, and DOCX files are allowed.'), false);
  }
};

// File size limit (5MB)
const fileSizeLimit = 5 * 1024 * 1024;

// Create multer instances
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: fileSizeLimit
  }
});

export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG files are allowed for profile pictures.'), false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB for profile pictures
  }
});

export const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: fileSizeLimit
  }
});

export const uploadCertificate = multer({
  storage: certificateStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed for certificates.'), false);
    }
  },
  limits: {
    fileSize: fileSizeLimit
  }
});

// Multiple file upload for documents
export const uploadMultipleDocuments = multer({
  storage: documentStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: fileSizeLimit,
    files: 5 // Maximum 5 files
  }
});

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum file size is 5MB.'
      });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  } else if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  return res.status(500).json({
    success: false,
    message: 'File upload error.'
  });
};

// Helper function to delete file from Cloudinary
export const deleteFileFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};

// Helper function to upload file to Cloudinary
export const uploadToCloudinary = async (file, folder = 'mediconnect') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    
    return {
      public_id: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Helper function to get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Helper function to validate file type
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.mimetype);
};

// Helper function to validate file size
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

// Middleware to handle file upload errors
export const uploadErrorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }
  next();
};

// Middleware to check if file exists
export const checkFileExists = (fieldName) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return res.status(400).json({
        success: false,
        message: `No ${fieldName} file provided.`
      });
    }
    next();
  };
};

// Middleware to validate image dimensions
export const validateImageDimensions = (minWidth, minHeight, maxWidth, maxHeight) => {
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }

    // This would require additional processing to get image dimensions
    // For now, we'll just pass through
    next();
  };
};

// Configure multer for file uploads
const memoryStorage = multer.memoryStorage();

const memoryUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

export default memoryUpload; 