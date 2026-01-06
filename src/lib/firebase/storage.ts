import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

/**
 * Compress image before upload
 */
export const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("Failed to compress image"));
                        }
                    },
                    "image/jpeg",
                    quality
                );
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Upload image to Firebase Storage
 */
export const uploadImage = async (
    file: File,
    userId: string,
    date: string,
    compress: boolean = true
): Promise<string> => {
    try {
        let fileToUpload: Blob | File = file;

        // Compress if it's an image and compression is enabled
        if (compress && file.type.startsWith("image/")) {
            fileToUpload = await compressImage(file);
        }

        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `users/${userId}/daily_logs/${date}/photos/${fileName}`);
        const snapshot = await uploadBytes(storageRef, fileToUpload);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

/**
 * Upload video to Firebase Storage
 */
export const uploadVideo = async (
    file: File,
    userId: string,
    date: string
): Promise<string> => {
    try {
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `users/${userId}/daily_logs/${date}/videos/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading video:", error);
        throw error;
    }
};

/**
 * Delete file from Firebase Storage
 */
export const deleteFile = async (url: string): Promise<void> => {
    try {
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
};

