import { Platform } from 'react-native';

export const uploadImageToCloudinary = async (imageUri) => {

    const data = new FormData();
    try {
        if (Platform.OS === 'web') {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            data.append('file', blob);

        } else {
            data.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: `car_${Date.now()}.jpg`,
            });
        }

        data.append('upload_preset', 'car-rental-app');

        const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/ddiirksy2/image/upload',
            {
                method: 'POST',
                body: data,
            }
        );

        const result = await cloudinaryResponse.json();
        console.log('Cloudinary Result:', result);
        if (result.secure_url) {
            return {
                url: result.secure_url,
                public_id: result.public_id,
            };
        }
        return null;

    } catch (error) {
        console.log('Cloudinary Error:', error);
        return null;
    }
};