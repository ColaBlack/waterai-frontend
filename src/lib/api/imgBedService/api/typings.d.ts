declare namespace API {
  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type deleteFileParams = {
    /** 文件URL */
    fileUrl: string;
  };

  type uploadAvatarParams = {
    /** 用户ID */
    userId: number;
  };

  type uploadChatImageParams = {
    /** 聊天ID */
    chatId: string;
  };

  type uploadFileParams = {
    /** 文件夹路径 */
    folder?: string;
  };
}
