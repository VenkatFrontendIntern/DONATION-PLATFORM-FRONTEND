/**
 * Check if a URL is a Cloudinary URL
 */
const isCloudinaryUrl = (url: string): boolean => {
  return /res\.cloudinary\.com|cloudinary\.com/.test(url);
};

/**
 * Check if a Cloudinary URL already has transformations applied
 */
const hasExistingTransformations = (url: string): boolean => {
  // Check for common transformation patterns in the URL
  // Transformations typically appear between /image/upload/ and the version/publicId
  const uploadMatch = url.match(/\/image\/upload\/([^/]+)/);
  if (!uploadMatch) return false;
  
  const afterUpload = uploadMatch[1];
  // Check for transformation indicators like w_, h_, c_, f_, q_, etc.
  return /^[a-z_]+,[a-z_]+/i.test(afterUpload) || 
         /^(w_|h_|c_|f_|q_|a_|ar_|b_|bo_|co_|dpr_|du_|e_|eo_|fl_|g_|h_|l_|o_|p_|q_|r_|t_|u_|w_|x_|y_|z_)/i.test(afterUpload);
};

/**
 * Extract the public ID and version from a Cloudinary URL
 */
const parseCloudinaryUrl = (url: string): { publicId: string; version?: string } | null => {
  // Match Cloudinary URL patterns:
  // https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
  // https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
  
  // Extract everything after /image/upload/
  const uploadMatch = url.match(/\/image\/upload\/(.+)$/);
  if (!uploadMatch) return null;
  
  let afterUpload = uploadMatch[1];
  
  // Check if there's a version pattern (v123/)
  const versionMatch = afterUpload.match(/^v(\d+)\/(.+)$/);
  if (versionMatch) {
    return {
      publicId: versionMatch[2],
      version: versionMatch[1],
    };
  }
  
  // No version - everything after /image/upload/ is the public ID
  return {
    publicId: afterUpload,
  };
};

/**
 * Build a Cloudinary transformation URL
 */
const buildCloudinaryUrl = (
  originalUrl: string,
  publicId: string,
  version: string | undefined,
  transformations: string[]
): string => {
  // Extract the base URL (everything before /image/upload)
  const baseMatch = originalUrl.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload)/);
  if (!baseMatch) return originalUrl; // Fallback if pattern doesn't match
  
  const uploadBase = baseMatch[1];
  const transformStr = transformations.join(',');
  const versionStr = version ? `v${version}/` : '';
  
  // Build: /image/upload/{transformations}/{version?}{publicId}
  return `${uploadBase}/${transformStr}/${versionStr}${publicId}`;
};

/**
 * Get the full image URL, handling both Cloudinary URLs and local file paths
 * @param imagePath - Can be a Cloudinary URL (http/https) or a local file path
 * @param width - Optional width in pixels for image optimization (works with Cloudinary)
 * @returns Full URL that can be used in img src
 */
export const getImageUrl = (
  imagePath: string | null | undefined,
  width?: number
): string => {
  if (!imagePath) {
    // Return a placeholder image if no path provided
    return 'https://via.placeholder.com/800x600?text=No+Image';
  }

  // If it's already a full URL (http/https)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // Check if it's a Cloudinary URL and apply optimizations
    if (isCloudinaryUrl(imagePath)) {
      // Parse the Cloudinary URL
      const parsed = parseCloudinaryUrl(imagePath);
      if (parsed) {
        // Build transformation parameters
        const transformations: string[] = ['f_auto', 'q_auto'];
        
        // Add width transformation if specified
        if (width) {
          transformations.push(`w_${width}`);
        }
        
        return buildCloudinaryUrl(imagePath, parsed.publicId, parsed.version, transformations);
      }
    }
    
    // Return as-is if not Cloudinary or parsing failed
    return imagePath;
  }

  // If it's a local path, prepend the backend URL and normalize slashes
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // Remove /api from backend URL if present (since we want the base URL)
  const baseUrl = backendUrl.replace(/\/api$/, '');
  
  // Normalize path: replace backslashes with forward slashes, remove leading slash
  const normalizedPath = imagePath.replace(/\\/g, '/').replace(/^\//, '');
  
  // If path already starts with uploads, use it directly, otherwise prepend /uploads/
  const finalPath = normalizedPath.startsWith('uploads/') 
    ? normalizedPath 
    : `uploads/${normalizedPath}`;
  
  return `${baseUrl}/${finalPath}`;
};

