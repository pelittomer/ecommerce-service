export const PRODUCT_MESSAGE = {
    PRODUCT_CREATED_SUCCESS: 'Product successfully created.',
    PRODUCT_NOT_FOUND: 'Product not found!',
    PRODUCT_UPDATED_SUCCESS: 'Product successfully updated.',
    IMAGE_UPLOAD_FAILED_NO_IMAGE: 'Image upload failed. Please select at least one image.',
    IMAGE_UPLOAD_ONLY_IMAGES_ALLOWED: 'Only image files are allowed!',
    IMAGE_UPLOAD_FILE_TOO_LARGE: (filename: string) => `The file '${filename}' is too large. Maximum file size is 5MB.`,
    COMPANY_NOT_CREATED: 'You have not created a company yet.',
    COMPANY_NOT_APPROVED: 'Your company status is not approved. You cannot create products.',
};