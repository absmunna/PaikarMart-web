import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, storage, auth, handleFirestoreError, OperationType } from "../lib/firebase";

export type UploadRoleType = 'product' | 'reel' | 'service' | 'vault' | 'document' | 'demand';

export interface UploadMetadata {
  title: string;
  description?: string;
  price?: number;
  moq?: number;
  category?: string;
  location?: string;
  tags?: string[];
  productLink?: string;
  rateUnit?: string;
}

export interface UploadProgressCallback {
  (progress: number, downloadUrl?: string): void;
}

export const uploadService = {
  /**
   * Upload file to Firebase Storage and save record to corresponding Firestore collection based on user role/type
   */
  async uploadProfileImage(
    file: File,
    type: 'avatar' | 'cover',
    onProgress?: UploadProgressCallback
  ): Promise<string> {
    const user = auth.currentUser;
    const userId = user?.uid || 'guest-user';
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `users/${userId}/${type}/${timestamp}_${cleanFileName}`;

    const storageRef = ref(storage, storagePath);
    let downloadUrl = "";

    try {
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          (error) => {
            console.warn("Storage upload task error, generating local object URL as fallback:", error);
            downloadUrl = URL.createObjectURL(file);
            resolve();
          },
          async () => {
            try {
              downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            } catch (e) {
              downloadUrl = URL.createObjectURL(file);
              resolve();
            }
          }
        );
      });
    } catch (err) {
      console.warn("Upload exception handled:", err);
      downloadUrl = URL.createObjectURL(file);
    }

    if (!downloadUrl) {
      downloadUrl = URL.createObjectURL(file);
    }

    return downloadUrl;
  },

  async uploadContent(
    file: File,
    type: UploadRoleType,
    metadata: UploadMetadata,
    onProgress?: UploadProgressCallback
  ): Promise<{ id: string; downloadUrl: string }> {
    const user = auth.currentUser;
    const userId = user?.uid || 'guest-user';
    const userName = user?.displayName || user?.email?.split('@')[0] || 'PaikarMart User';
    const userAvatar = user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${type}s/${userId}/${timestamp}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    let downloadUrl = "";

    try {
      // 1. Upload to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          (error) => {
            console.warn("Storage upload task error, generating local object URL as fallback:", error);
            // Fallback for offline/unauthenticated preview
            downloadUrl = URL.createObjectURL(file);
            resolve();
          },
          async () => {
            try {
              downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            } catch (e) {
              downloadUrl = URL.createObjectURL(file);
              resolve();
            }
          }
        );
      });
    } catch (err) {
      console.warn("Upload exception handled:", err);
      downloadUrl = URL.createObjectURL(file);
    }

    if (!downloadUrl) {
      downloadUrl = URL.createObjectURL(file);
    }

    const docId = `item_${type}_${timestamp}`;

    // 2. Write metadata to Firestore database
    try {
      if (type === 'product') {
        const path = `products/${docId}`;
        await setDoc(doc(db, 'products', docId), {
          id: docId,
          sellerId: userId,
          sellerName: userName,
          title: metadata.title,
          description: metadata.description || '',
          price: metadata.price || 0,
          moq: metadata.moq || 1,
          categoryId: metadata.category?.toLowerCase() || 'general',
          categoryName: metadata.category || 'General',
          status: 'active',
          images: [downloadUrl],
          location: metadata.location || 'Dhaka, Bangladesh',
          tags: metadata.tags || ['paikarmart'],
          stock: 10,
          views: 0,
          type: 'retail',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else if (type === 'reel') {
        const path = `posts/${docId}`;
        await setDoc(doc(db, 'posts', docId), {
          id: docId,
          sellerId: userId,
          sellerName: userName,
          sellerAvatar: userAvatar,
          content: `${metadata.title}\n${metadata.description || ''}`,
          image: downloadUrl,
          price: metadata.price ? `৳ ${metadata.price}` : undefined,
          type: 'reel',
          category: metadata.category || 'Video',
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Also index in reels collection
        await setDoc(doc(db, 'reels', docId), {
          id: docId,
          creatorId: userId,
          creatorName: userName,
          creatorAvatar: userAvatar,
          title: metadata.title,
          caption: metadata.description || '',
          videoUrl: downloadUrl,
          thumbnailUrl: downloadUrl,
          productLink: metadata.productLink || '',
          likesCount: 0,
          viewsCount: 1,
          createdAt: serverTimestamp()
        });
      } else if (type === 'service') {
        await setDoc(doc(db, 'services', docId), {
          id: docId,
          providerId: userId,
          providerName: userName,
          title: metadata.title,
          description: metadata.description || '',
          rate: metadata.price || 500,
          rateUnit: metadata.rateUnit || 'per job',
          category: metadata.category || 'Home Services',
          area: metadata.location || 'Dhaka',
          mediaUrl: downloadUrl,
          createdAt: serverTimestamp()
        });
      } else if (type === 'demand') {
        const path = `posts/${docId}`;
        await setDoc(doc(db, 'posts', docId), {
          id: docId,
          sellerId: userId, // Using sellerId field for author for consistency in posts
          sellerName: userName,
          sellerAvatar: userAvatar,
          content: `${metadata.title}\n${metadata.description || ''}`,
          image: downloadUrl,
          price: metadata.price ? `Budget: ৳ ${metadata.price}` : undefined,
          type: 'demand',
          category: metadata.category || 'Buyer Request',
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Vault file / document
        await setDoc(doc(db, 'client_vault_files', docId), {
          id: docId,
          userId: userId,
          name: metadata.title || file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          url: downloadUrl,
          uploadedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.warn("Firestore record write notice:", error);
    }

    if (onProgress) onProgress(100, downloadUrl);
    return { id: docId, downloadUrl };
  }
};
