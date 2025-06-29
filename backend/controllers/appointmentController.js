import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// @desc    Book appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, symptoms } = req.body;

    // Get doctor details
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if doctor is approved
    if (!doctor.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not approved yet'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      symptoms,
      consultationFee: doctor.consultationFee,
      paymentStatus: 'paid',
      status: 'confirmed'
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        appointment
      }
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment'
    });
  }
};

// @desc    Get patient appointments
// @route   GET /api/appointments/patient
// @access  Private (Patient)
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization hospital')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        appointments
      }
    });
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments'
    });
  }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        appointments
      }
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments'
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Doctor)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, diagnosis, prescription } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own appointments'
      });
    }

    appointment.status = status;
    if (diagnosis) appointment.diagnosis = diagnosis;
    if (prescription) appointment.prescription = prescription;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: {
        appointment
      }
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment'
    });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Patient)
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own appointments'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment'
    });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private (Admin)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        appointments
      }
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments'
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.userRole === 'patient') {
      query.patient = req.user._id;
    } else if (req.userRole === 'doctor') {
      query.doctor = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone dateOfBirth gender')
      .populate('doctor', 'name specialization profilePicture')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        appointments,
        totalAppointments: total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments'
    });
  }
}; 