const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload audio file to Cloudinary
const uploadAudio = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // Use 'video' for audio files in Cloudinary
        folder: 'soundcloud-clone/audio',
        format: 'mp3',
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Upload image to Cloudinary
const uploadImage = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'soundcloud-clone/images',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' }
        ],
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Delete file from Cloudinary
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// Generate waveform data (placeholder - in real app you'd use audio processing)
const generateWaveform = (buffer) => {
  // This is a placeholder. In a real application, you would use libraries like:
  // - node-ffmpeg to extract audio data
  // - audiowaveform or similar to generate actual waveform data
  
  // For demo purposes, generate random waveform data
  const waveformData = [];
  const points = 1000; // Number of waveform points
  
  for (let i = 0; i < points; i++) {
    waveformData.push(Math.random() * 100);
  }
  
  return waveformData;
};

module.exports = {
  uploadAudio,
  uploadImage,
  deleteFile,
  generateWaveform
};