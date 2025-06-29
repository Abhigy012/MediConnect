import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Admin from '../models/Admin.js';

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user based on role
    let user = null;
    
    if (decoded.role === 'patient') {
      user = await User.findById(decoded.id).select('-password');
    } else if (decoded.role === 'doctor') {
      user = await Doctor.findById(decoded.id).select('-password');
    } else if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Middleware to check if user is a patient
export const isPatient = (req, res, next) => {
  if (req.userRole !== 'patient') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Patient role required.'
    });
  }
  next();
};

// Middleware to check if user is a doctor
export const isDoctor = (req, res, next) => {
  if (req.userRole !== 'doctor') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Doctor role required.'
    });
  }
  
  // Check if doctor is approved
  if (!req.user.isApproved) {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending approval. Please wait for admin approval.'
    });
  }
  
  next();
};

// Middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

// Middleware to check if user is a super admin
export const isSuperAdmin = (req, res, next) => {
  if (req.userRole !== 'admin' || req.user.role !== 'super-admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super admin role required.'
    });
  }
  next();
};

// Middleware to check specific permissions
export const hasPermission = (permission) => {
  return (req, res, next) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${permission} permission required.`
      });
    }

    next();
  };
};

// Middleware to check if user owns the resource
export const isOwner = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found.'
        });
      }

      // Check if user owns the resource or is admin
      if (resource.user?.toString() !== req.user._id.toString() && 
          resource.patient?.toString() !== req.user._id.toString() &&
          resource.doctor?.toString() !== req.user._id.toString() &&
          req.userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.'
      });
    }
  };
};

// Middleware to handle rate limiting for login attempts
export const checkLoginAttempts = async (req, res, next) => {
  try {
    const { email } = req.body;
    let user = null;

    // Check in all user collections
    user = await User.findOne({ email }).select('+loginAttempts +lockUntil');
    if (!user) {
      user = await Doctor.findOne({ email }).select('+loginAttempts +lockUntil');
    }
    if (!user) {
      user = await Admin.findOne({ email }).select('+loginAttempts +lockUntil');
    }

    if (user && user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// Middleware to update last login
export const updateLastLogin = async (req, res, next) => {
  try {
    if (req.user) {
      const updateData = { lastLogin: new Date() };
      
      if (req.userRole === 'patient') {
        await User.findByIdAndUpdate(req.user._id, updateData);
      } else if (req.userRole === 'doctor') {
        await Doctor.findByIdAndUpdate(req.user._id, updateData);
      } else if (req.userRole === 'admin') {
        await Admin.findByIdAndUpdate(req.user._id, updateData);
      }
    }
    next();
  } catch (error) {
    // Don't block the request if this fails
    next();
  }
};

// Middleware to log admin activity
export const logAdminActivity = (action) => {
  return async (req, res, next) => {
    try {
      if (req.userRole === 'admin' && req.user) {
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent') || '';
        
        await req.user.addActivity(action, req.body.description || '', ipAddress, userAgent);
      }
      next();
    } catch (error) {
      // Don't block the request if logging fails
      next();
    }
  };
}; 