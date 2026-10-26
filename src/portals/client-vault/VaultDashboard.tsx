import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, File as FileIcon, Trash2, Download, Loader2, HardDrive } from "lucide-react";
import { db, storage, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { DatabaseBackupModal } from "../../components/backup/DatabaseBackupModal";

interface VaultFile {
  id: string;
  userId: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: any;
}

export default function VaultDashboard() {
  const { user } = useAuth();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "client_vault_files"),
      where("userId", "==", user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedFiles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VaultFile[];
      
      // Sort in memory as we didn't create a composite index for uploadedAt yet
      fetchedFiles.sort((a, b) => {
        const timeA = a.uploadedAt?.toMillis?.() || 0;
        const timeB = b.uploadedAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      setFiles(fetchedFiles);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "client_vault_files");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    
    const file = e.target.files[0];
    setUploading(true);
    setUploadProgress(0);

    // Create a storage reference
    const storageRef = ref(storage, `users/${user.id}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error("Storage upload error", error);
        alert("Failed to upload file. Please check Firebase Storage Rules.");
        setUploading(false);
      }, 
      async () => {
        // Upload completed successfully
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Save metadata to Firestore
          await addDoc(collection(db, "client_vault_files"), {
            userId: user.id,
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
            url: downloadURL,
            uploadedAt: serverTimestamp()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, "client_vault_files");
        } finally {
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      }
    );
  };

  const handleDelete = async (file: VaultFile) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;
    
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, "client_vault_files", file.id));
      
      // 2. Delete from Storage (best effort based on URL, or ideally we'd store the storage path)
      // Since we didn't store the exact path, we can extract it from the URL or just rely on Firestore delete for this demo.
      // A more robust implementation would store the storageRef path in Firestore.
      try {
        const fileRef = ref(storage, file.url);
        await deleteObject(fileRef);
      } catch (storageErr) {
        console.log("Could not delete from storage, but metadata removed", storageErr);
      }

    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `client_vault_files/${file.id}`);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#FF7A00]">Client Vault & Media Hub</h1>
          <p className="text-gray-400 mt-1">Manage and securely store your files & backup database records.</p>
        </div>
        <button
          onClick={() => setIsBackupOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md"
        >
          <HardDrive className="w-4 h-4" />
          <span>Firebase Backup</span>
        </button>
      </div>

      {/* Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
        />
        <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Upload a new file</h3>
        <p className="text-gray-500 mt-2 max-w-sm">Click here or drag and drop your files into this area to securely upload them to your vault.</p>
        
        {uploading && (
          <div className="w-full max-w-xs mt-6">
            <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Files</h2>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <FileIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No files yet</h3>
            <p className="text-gray-500 mt-1">Upload your first file to see it here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">File Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Size</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date Uploaded</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <FileIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatSize(file.size)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(file.uploadedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <a 
                            href={file.url}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download/View"
                          >
                            <Download className="h-5 w-5" />
                          </a>
                          <button 
                            onClick={() => handleDelete(file)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete File"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <DatabaseBackupModal 
        isOpen={isBackupOpen} 
        onClose={() => setIsBackupOpen(false)} 
      />
    </div>
  );
}
