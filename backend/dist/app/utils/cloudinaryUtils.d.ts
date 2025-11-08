export declare const generateCloudinaryFolderPath: (schoolName: string, role: "student" | "teacher", firstName: string, dob: Date, bloodGroup: string, date: Date, grade?: number, section?: string, entityId?: string) => string;
export declare const uploadPhotosToCloudinary: (files: Express.Multer.File[], folderPath: string, _entityId: string) => Promise<Array<{
    public_id: string;
    secure_url: string;
    photoNumber: number;
    originalName: string;
    size: number;
}>>;
export declare const deletePhotosFromCloudinary: (publicIds: string[]) => Promise<void>;
export declare const createSchoolFolderStructure: (schoolName: string) => Promise<void>;
export declare const getAvailablePhotoSlots: (existingPhotoNumbers: number[]) => number[];
export declare const uploadToCloudinary: (fileBuffer: Buffer, options: {
    folder: string;
    resource_type?: "image" | "video" | "raw" | "auto";
    use_filename?: boolean;
    unique_filename?: boolean;
}) => Promise<{
    public_id: string;
    secure_url: string;
    resource_type: string;
    format: string;
    bytes: number;
}>;
export declare const deleteFromCloudinary: (publicId: string) => Promise<void>;
//# sourceMappingURL=cloudinaryUtils.d.ts.map