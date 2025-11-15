/**
 * 图片压缩工具函数
 */

export interface CompressOptions {
  /** 最大宽度（像素） */
  maxWidth?: number;
  /** 最大高度（像素） */
  maxHeight?: number;
  /** 压缩质量（0-1，默认0.8） */
  quality?: number;
  /** 输出格式（默认'image/jpeg'） */
  outputFormat?: string;
}

/**
 * 压缩图片
 * @param file 原始图片文件
 * @param options 压缩选项
 * @returns 压缩后的File对象
 */
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
        // 计算新尺寸
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
        
        // 创建canvas进行压缩
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建canvas上下文'));
          return;
        }
        
        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('图片压缩失败'));
              return;
            }
            
            // 创建新的File对象
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

/**
 * 验证图片文件
 * @param file 文件对象
 * @param maxSize 最大文件大小（字节，默认5MB）
 * @returns 验证结果和错误信息
 */
export function validateImageFile(
  file: File,
  maxSize: number = 5 * 1024 * 1024
): { valid: boolean; error?: string } {
  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: '只支持JPG、PNG、GIF、WEBP格式的图片',
    };
  }
  
  // 验证文件大小
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `图片大小不能超过${(maxSize / 1024 / 1024).toFixed(0)}MB`,
    };
  }
  
  return { valid: true };
}


