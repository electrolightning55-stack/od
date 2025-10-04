
import { userRequest } from '@/lib/RequestMethods';

// Upload file to S3 using presigned URL
export const uploadFileToS3 = async (file, presignedUrl) => {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed with status: ${response.status}. ${errorText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

// Get presigned URL for file upload
export const getPresignedUrl = async (fileName, fileType) => {
  try {
    console.log('Requesting presigned URL for:', { fileName, fileType });
    const response = await userRequest.post('/file/presigned-url', {
      fileName,
      fileType,
    });
    
    if (response.data.status !== 'success' || !response.data.data || !response.data.data.uploadUrl) {
      throw new Error('Invalid response from server');
    }
    
    console.log('Presigned URL response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    if (error.response?.data) {
      console.error('Server error:', error.response.data);
    }
    throw new Error(
      error.response?.data?.message || 
      'Failed to get upload URL. Please try again.'
    );
  }
};
