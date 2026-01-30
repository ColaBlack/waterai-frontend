export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputFormat?: string;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    outputFormat = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            if (width > maxWidth) {
              height = (height / width) * maxWidth;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width / height) * maxHeight;
              height = maxHeight;
            }
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建canvas上下文'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('图片压缩失败'));
              return;
            }
            
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '') + '.jpg',
              {
                type: outputFormat,
                lastModified: Date.now(),
              }
            );
            
            resolve(compressedFile);
          },
          outputFormat,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(
  file: File,
  maxSize: number = 5 * 1024 * 1024
): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: '只支持JPG、PNG、GIF、WEBP格式的图片',
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `图片大小不能超过${(maxSize / 1024 / 1024).toFixed(0)}MB`,
    };
  }
  
  return { valid: true };
}
