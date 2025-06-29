import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import cloudinary from '../config/cloudinary.js';

const testCloudinary = async () => {
    console.log('☁️  Testing Cloudinary Configuration...\n');
    
    // Check environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
        console.error('❌ Cloudinary environment variables are missing!');
        console.log('\n📝 Please add these to your backend/.env file:');
        console.log('CLOUDINARY_CLOUD_NAME=your-cloud-name');
        console.log('CLOUDINARY_API_KEY=your-api-key');
        console.log('CLOUDINARY_API_SECRET=your-api-secret');
        process.exit(1);
    }
    
    console.log('✅ Environment variables found');
    console.log('Cloud Name:', cloudName);
    console.log('API Key:', apiKey.substring(0, 8) + '...');
    console.log('API Secret:', apiSecret.substring(0, 8) + '...');
    
    try {
        // Test Cloudinary configuration
        console.log('\n📡 Testing Cloudinary connection...');
        
        // Test upload with a simple image URL
        const testImageUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop';
        
        console.log('📤 Uploading test image...');
        const result = await cloudinary.uploader.upload(testImageUrl, {
            folder: 'mediconnect/test',
            public_id: 'test-upload-' + Date.now(),
            overwrite: true
        });
        
        console.log('✅ Upload successful!');
        console.log('📊 Image URL:', result.secure_url);
        console.log('📁 Public ID:', result.public_id);
        console.log('📏 Size:', result.bytes, 'bytes');
        console.log('📐 Dimensions:', result.width, 'x', result.height);
        
        // Test image transformation
        console.log('\n🔄 Testing image transformation...');
        const transformedUrl = cloudinary.url(result.public_id, {
            transformation: [
                { width: 200, height: 200, crop: 'fill' },
                { quality: 'auto' }
            ]
        });
        
        console.log('✅ Transformation successful!');
        console.log('🔗 Transformed URL:', transformedUrl);
        
        // Clean up test image
        console.log('\n🧹 Cleaning up test image...');
        await cloudinary.uploader.destroy(result.public_id);
        console.log('✅ Test image deleted');
        
        console.log('\n🎉 Cloudinary setup is working perfectly!');
        console.log('\n📝 You can now:');
        console.log('- Upload doctor profile images');
        console.log('- Transform images automatically');
        console.log('- Use Cloudinary for all image needs');
        
    } catch (error) {
        console.error('\n❌ Cloudinary test failed!');
        console.error('Error:', error.message);
        
        if (error.message.includes('Invalid api_key')) {
            console.log('\n🔑 API Key Error - Check your Cloudinary API key');
        } else if (error.message.includes('Invalid signature')) {
            console.log('\n🔐 Signature Error - Check your API secret');
        } else if (error.message.includes('cloud_name')) {
            console.log('\n☁️  Cloud Name Error - Check your cloud name');
        } else if (error.message.includes('network')) {
            console.log('\n🌐 Network Error - Check your internet connection');
        }
        
        console.log('\n📖 For help, see CLOUDINARY_SETUP.md');
        process.exit(1);
    }
};

// Run the test
testCloudinary(); 