import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all approved doctors
// @route   GET /api/doctors
// @access  Public
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, city } = req.query;
    
    let query = { isApproved: true, status: 'active' };
    
    if (specialization) {
      query.specialization = specialization;
    }
    
    if (city) {
      query['hospital.address.city'] = { $regex: city, $options: 'i' };
    }

    const doctors = await Doctor.find(query)
      .select('-password')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      data: {
        doctors
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctors'
    });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id)
      .select('-password');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        doctor
      }
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor'
    });
  }
};

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private (Doctor)
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id)
      .select('-password');

    res.status(200).json({
      success: true,
      data: {
        doctor
      }
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor)
export const updateDoctorProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated
    delete updateData.password;
    delete updateData.email;
    delete updateData.isApproved;
    delete updateData.status;

    const doctor = await Doctor.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        doctor
      }
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// @desc    Get doctor's patients
// @route   GET /api/doctors/patients
// @access  Private (Doctor)
export const getDoctorPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone dateOfBirth gender')
      .sort({ appointmentDate: -1 });

    // Get unique patients
    const patients = [];
    const patientIds = new Set();

    appointments.forEach(appointment => {
      if (!patientIds.has(appointment.patient._id.toString())) {
        patientIds.add(appointment.patient._id.toString());
        patients.push(appointment.patient);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        patients
      }
    });
  } catch (error) {
    console.error('Get doctor patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patients'
    });
  }
};

// @desc    Get pending doctors (Admin)
// @route   GET /api/doctors/pending
// @access  Private (Admin)
export const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        doctors
      }
    });
  } catch (error) {
    console.error('Get pending doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending doctors'
    });
  }
};

// @desc    Approve/Reject doctor (Admin)
// @route   PUT /api/doctors/:id/approve
// @access  Private (Admin)
export const approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    doctor.isApproved = isApproved;
    doctor.status = isApproved ? 'active' : 'inactive';
    
    await doctor.save();

    res.status(200).json({
      success: true,
      message: `Doctor ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: {
        doctor
      }
    });
  } catch (error) {
    console.error('Approve doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve doctor'
    });
  }
}; 