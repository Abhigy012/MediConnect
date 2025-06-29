import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const { user } = useAuth()
    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const specializations = [
        'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
        'General Medicine', 'Gynecology', 'Neurology', 'Oncology',
        'Ophthalmology', 'Orthopedics', 'Pediatrics', 'Psychiatry',
        'Pulmonology', 'Radiology', 'Surgery', 'Urology', 'Other'
    ];

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const workingDaysOptions = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    // Function to update user profile data using API
    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();

            // Common fields
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('gender', userData.gender)
            formData.append('dateOfBirth', userData.dateOfBirth)

            // Role-specific fields
            if (user?.role === 'patient') {
                formData.append('address', JSON.stringify(userData.address))
                formData.append('bloodGroup', userData.bloodGroup)
            } else if (user?.role === 'doctor') {
                formData.append('specialization', userData.specialization)
                formData.append('experience', userData.experience)
                formData.append('licenseNumber', userData.licenseNumber)
                formData.append('hospital', JSON.stringify(userData.hospital))
                formData.append('consultationFee', userData.consultationFee)
                formData.append('workingDays', JSON.stringify(userData.workingDays))
                formData.append('workingHours', JSON.stringify(userData.workingHours))
                formData.append('bio', userData.bio)
            }

            image && formData.append('image', image)

            const endpoint = user?.role === 'doctor' ? '/api/doctors/profile' : '/api/auth/profile'
            const { data } = await axios.put(backendUrl + endpoint, formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleWorkingDaysChange = (day) => {
        setUserData(prev => ({
            ...prev,
            workingDays: prev.workingDays?.includes(day)
                ? prev.workingDays.filter(d => d !== day)
                : [...(prev.workingDays || []), day]
        }));
    };

    return userData ? (
        <div className='max-w-4xl flex flex-col gap-6 text-sm pt-5'>
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6">
                {isEdit
                    ? <label htmlFor='image' >
                        <div className='inline-block relative cursor-pointer'>
                            <img className='w-36 h-36 rounded-full object-cover opacity-75' src={image ? URL.createObjectURL(image) : userData.profilePicture || userData.image} alt="" />
                            <img className='w-10 absolute bottom-2 right-2' src={image ? '' : assets.upload_icon} alt="" />
                        </div>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </label>
                    : <img className='w-36 h-36 rounded-full object-cover' src={userData.profilePicture || userData.image} alt="" />
                }

                <div>
                    {isEdit
                        ? <input className='bg-gray-50 text-3xl font-medium max-w-60 border rounded px-2 py-1' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                        : <p className='font-medium text-3xl text-[#262626]'>{userData.name}</p>
                    }
                    <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
            </div>

            <hr className='bg-[#ADADAD] h-[1px] border-none' />

            {/* Contact Information */}
            <div>
                <p className='text-gray-600 underline mt-3 font-semibold'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    <p className='font-medium'>Email:</p>
                    <p className='text-blue-500'>{userData.email}</p>
                    
                    <p className='font-medium'>Phone:</p>
                    {isEdit
                        ? <input className='bg-gray-50 max-w-52 border rounded px-2 py-1' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                        : <p className='text-blue-500'>{userData.phone}</p>
                    }

                    {/* Patient Address */}
                    {user?.role === 'patient' && (
                        <>
                            <p className='font-medium'>Address:</p>
                            {isEdit
                                ? <div className="space-y-2">
                                    <input className='bg-gray-50 w-full border rounded px-2 py-1' type="text" placeholder="Street" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))} value={userData.address?.street || ''} />
                                    <input className='bg-gray-50 w-full border rounded px-2 py-1' type="text" placeholder="City" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))} value={userData.address?.city || ''} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input className='bg-gray-50 border rounded px-2 py-1' type="text" placeholder="State" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))} value={userData.address?.state || ''} />
                                        <input className='bg-gray-50 border rounded px-2 py-1' type="text" placeholder="ZIP Code" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, zipCode: e.target.value } }))} value={userData.address?.zipCode || ''} />
                                    </div>
                                </div>
                                : <p className='text-gray-500'>
                                    {userData.address?.street && `${userData.address.street}, `}
                                    {userData.address?.city && `${userData.address.city}, `}
                                    {userData.address?.state && `${userData.address.state} `}
                                    {userData.address?.zipCode && userData.address.zipCode}
                                </p>
                            }
                        </>
                    )}

                    {/* Doctor Hospital Information */}
                    {user?.role === 'doctor' && (
                        <>
                            <p className='font-medium'>Hospital:</p>
                            {isEdit
                                ? <input className='bg-gray-50 w-full border rounded px-2 py-1' type="text" onChange={(e) => setUserData(prev => ({ ...prev, hospital: { ...prev.hospital, name: e.target.value } }))} value={userData.hospital?.name || ''} />
                                : <p className='text-gray-500'>{userData.hospital?.name}</p>
                            }
                        </>
                    )}
                </div>
            </div>

            {/* Basic Information */}
            <div>
                <p className='text-[#797979] underline mt-3 font-semibold'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                    <p className='font-medium'>Gender:</p>
                    {isEdit
                        ? <select className='max-w-32 bg-gray-50 border rounded px-2 py-1' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        : <p className='text-gray-500 capitalize'>{userData.gender}</p>
                    }

                    <p className='font-medium'>Date of Birth:</p>
                    {isEdit
                        ? <input className='max-w-40 bg-gray-50 border rounded px-2 py-1' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dateOfBirth: e.target.value }))} value={userData.dateOfBirth} />
                        : <p className='text-gray-500'>{new Date(userData.dateOfBirth).toLocaleDateString()}</p>
                    }

                    {/* Patient Blood Group */}
                    {user?.role === 'patient' && (
                        <>
                            <p className='font-medium'>Blood Group:</p>
                            {isEdit
                                ? <select className='max-w-32 bg-gray-50 border rounded px-2 py-1' onChange={(e) => setUserData(prev => ({ ...prev, bloodGroup: e.target.value }))} value={userData.bloodGroup || ''} >
                                    <option value="">Select Blood Group</option>
                                    {bloodGroups.map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </select>
                                : <p className='text-gray-500'>{userData.bloodGroup || 'Not specified'}</p>
                            }
                        </>
                    )}

                    {/* Doctor Specific Fields */}
                    {user?.role === 'doctor' && (
                        <>
                            <p className='font-medium'>Specialization:</p>
                            {isEdit
                                ? <select className='w-full bg-gray-50 border rounded px-2 py-1' onChange={(e) => setUserData(prev => ({ ...prev, specialization: e.target.value }))} value={userData.specialization || ''} >
                                    <option value="">Select Specialization</option>
                                    {specializations.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                                : <p className='text-gray-500'>{userData.specialization}</p>
                            }

                            <p className='font-medium'>Experience:</p>
                            {isEdit
                                ? <input className='max-w-32 bg-gray-50 border rounded px-2 py-1' type="number" min="0" onChange={(e) => setUserData(prev => ({ ...prev, experience: e.target.value }))} value={userData.experience || ''} />
                                : <p className='text-gray-500'>{userData.experience} years</p>
                            }

                            <p className='font-medium'>License Number:</p>
                            {isEdit
                                ? <input className='w-full bg-gray-50 border rounded px-2 py-1' type="text" onChange={(e) => setUserData(prev => ({ ...prev, licenseNumber: e.target.value }))} value={userData.licenseNumber || ''} />
                                : <p className='text-gray-500'>{userData.licenseNumber}</p>
                            }

                            <p className='font-medium'>Consultation Fee:</p>
                            {isEdit
                                ? <input className='max-w-32 bg-gray-50 border rounded px-2 py-1' type="number" min="0" step="0.01" onChange={(e) => setUserData(prev => ({ ...prev, consultationFee: e.target.value }))} value={userData.consultationFee || ''} />
                                : <p className='text-gray-500'>${userData.consultationFee}</p>
                            }

                            <p className='font-medium'>Working Hours:</p>
                            {isEdit
                                ? <div className="grid grid-cols-2 gap-2">
                                    <input className='bg-gray-50 border rounded px-2 py-1' type="time" onChange={(e) => setUserData(prev => ({ ...prev, workingHours: { ...prev.workingHours, start: e.target.value } }))} value={userData.workingHours?.start || ''} />
                                    <input className='bg-gray-50 border rounded px-2 py-1' type="time" onChange={(e) => setUserData(prev => ({ ...prev, workingHours: { ...prev.workingHours, end: e.target.value } }))} value={userData.workingHours?.end || ''} />
                                </div>
                                : <p className='text-gray-500'>{userData.workingHours?.start} - {userData.workingHours?.end}</p>
                            }

                            <p className='font-medium'>Working Days:</p>
                            {isEdit
                                ? <div className="grid grid-cols-4 gap-2">
                                    {workingDaysOptions.map(day => (
                                        <label key={day} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={userData.workingDays?.includes(day)}
                                                onChange={() => handleWorkingDaysChange(day)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 capitalize">{day}</span>
                                        </label>
                                    ))}
                                </div>
                                : <p className='text-gray-500'>{userData.workingDays?.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}</p>
                            }

                            <p className='font-medium'>Bio:</p>
                            {isEdit
                                ? <textarea className='w-full bg-gray-50 border rounded px-2 py-1' rows="3" onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))} value={userData.bio || ''} />
                                : <p className='text-gray-500'>{userData.bio || 'No bio available'}</p>
                            }
                        </>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className='mt-10'>
                {isEdit
                    ? <button onClick={updateUserProfileData} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Save Information</button>
                    : <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Edit Profile</button>
                }
            </div>
        </div>
    ) : null
}

export default MyProfile