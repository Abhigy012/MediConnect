# Cloudinary Setup Guide for MediConnect

## 🚀 Step 1: Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up For Free"
3. Create an account (you can use Google/GitHub)
4. Verify your email

## 🏗️ Step 2: Get Your Cloudinary Credentials

1. **Login to Cloudinary Dashboard**
2. **Go to Dashboard** (you'll see your credentials)
3. **Copy these values:**
   - Cloud Name
   - API Key
   - API Secret

## ⚙️ Step 3: Configure Environment Variables

Update your `backend/.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🧪 Step 4: Test Cloudinary Setup

Run the test script:
```bash
cd backend
npm run test-cloudinary
```

## 👨‍⚕️ Step 5: Add Sample Doctors

Run the sample data script:
```bash
cd backend
npm run add-sample-doctors
```

This will add one doctor for each specialization:
- General Physician
- Cardiologist
- Dermatologist
- Neurologist
- Pediatrician
- Gynecologist
- Orthopedic Surgeon
- Psychiatrist
- Ophthalmologist
- Gastroenterologist

## 📸 Step 6: Upload Profile Images

### Option A: Use Sample Images
The script will use placeholder images from:
- `https://images.unsplash.com/` (free stock photos)

### Option B: Upload Your Own Images
1. Go to Cloudinary Dashboard
2. Click "Upload" 
3. Upload doctor profile images
4. Copy the URLs and update the doctor data

## 🔧 Step 7: Verify Setup

1. **Check Cloudinary Dashboard:**
   - Go to Media Library
   - You should see uploaded images

2. **Test the Application:**
   - Start the backend: `npm start`
   - Start the frontend: `npm run dev`
   - Register as a patient
   - Browse doctors
   - Book an appointment

## 📁 File Structure

```
backend/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── scripts/
│   ├── add-sample-doctors.js  # Sample doctors data
│   └── test-cloudinary.js     # Cloudinary test script
└── .env                       # Environment variables
```

## 🎯 Sample Doctor Data

Each doctor will have:
- Professional profile
- Specialization
- Experience
- Education
- Profile image
- Contact information
- Available time slots

## 🚨 Troubleshooting

### Common Issues:

1. **Upload Failed:**
   - Check API credentials
   - Verify cloud name
   - Check internet connection

2. **Image Not Displaying:**
   - Check image URL
   - Verify Cloudinary settings
   - Check CORS settings

3. **Authentication Error:**
   - Double-check API key and secret
   - Ensure account is active

## 📞 Support

- **Cloudinary Documentation**: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Cloudinary Community**: [community.cloudinary.com](https://community.cloudinary.com)
- **Free Tier Limits**: 25 GB storage, 25 GB bandwidth/month

---

**Note**: Cloudinary free tier is sufficient for development and small projects. 