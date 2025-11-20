"use client";

import React, { useState, useEffect } from "react";
import { Upload, Button, Table, Space, Tag, Card, App } from "antd";
import GlobalLayout from "@/components/GlobalLayout";
import {
  UploadOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { listDocuments, deleteDocument } from "@/lib/api/chatService/api/knowledgeBaseController";
import { BASE_URL } from "@/lib/utils/request";

const KnowledgeManagePage: React.FC = () => {
  const { message, modal } = App.useApp();
  const [documents, setDocuments] = useState<API.KnowledgeBaseVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取文档列表
  const fetchDocuments = async () => {
    if (!mounted) return;
    
    setLoading(true);
    try {
      const response = await listDocuments();

      if (response.data.code === 200) {
        setDocuments(response.data.data || []);
      } else {
        message.error(response.data.message || "获取文档列表失败");
      }
    } catch (error) {
      console.error("获取文档列表失败:", error);
      message.error("获取文档列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchDocuments();
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  // 上传配置
  const uploadProps: UploadProps = {
    name: "file",
    action: `${BASE_URL}/knowledge/upload`,
    headers: {
      'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
    },
    accept: ".md,.pdf,.txt,.doc,.docx",
    beforeUpload: (file) => {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error("文件大小不能超过50MB!");
        return false;
      }
      return true;
    },
    onChange(info) {
      if (info.file.status === "uploading") {
        setUploading(true);
      }
      if (info.file.status === "done") {
        setUploading(false);
        // 检查业务响应码
        const response = info.file.response;
        if (response && response.code === 200) {
          message.success(`${info.file.name} 上传成功`);
          fetchDocuments(); // 刷新列表
        } else {
          message.error(response?.message || `${info.file.name} 上传失败`);
        }
      } else if (info.file.status === "error") {
        setUploading(false);
        const response = info.file.response;
        message.error(response?.message || `${info.file.name} 上传失败`);
      }
    },
  };

  // 删除文档
  const handleDelete = (id: number, fileName: string) => {
    modal.confirm({
      title: "确认删除",
      content: `确定要删除文档 "${fileName}" 吗？此操作不可恢复。`,
      okText: "确认",
      cancelText: "取消",
      okType: "danger",
      onOk: async () => {
        try {
          const response = await deleteDocument({ id });

          if (response.data.code === 200) {
            message.success("删除成功");
            fetchDocuments(); // 刷新列表
          } else {
            message.error(response.data.message || "删除失败");
          }
        } catch (error) {
          console.error("删除失败:", error);
          message.error("删除失败");
        }
      },
    });
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // 状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case 0:
        return <Tag icon={<ClockCircleOutlined />} color="processing">待处理</Tag>;
      case 1:
        return <Tag icon={<CheckCircleOutlined />} color="success">已处理</Tag>;
      case 2:
        return <Tag icon={<CloseCircleOutlined />} color="error">处理失败</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列配置
  const columns = [
    {
      title: "文件名",
      dataIndex: "fileName",
      key: "fileName",
      render: (text: string, record: API.KnowledgeBaseVO) => (
        <Space>
          <FileTextOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "文件类型",
      dataIndex: "fileType",
      key: "fileType",
      width: 100,
      render: (text: string) => <Tag>{text.toUpperCase()}</Tag>,
    },
    {
      title: "文件大小",
      dataIndex: "fileSize",
      key: "fileSize",
      width: 120,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: number) => getStatusTag(status),
    },
    {
      title: "上传时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 180,
      render: (time: string) => {
        if (!time) return "-";
        return new Date(time).toLocaleString("zh-CN");
      },
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_: any, record: API.KnowledgeBaseVO) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => record.id && record.fileName && handleDelete(record.id, record.fileName)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <GlobalLayout>
      <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "calc(100vh - 64px)" }}>
      <Card
        title="知识库管理"
        extra={
          <Upload {...uploadProps} showUploadList={false}>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              loading={uploading}
            >
              上传文档
            </Button>
          </Upload>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "#666" }}>
            支持的文件格式：Markdown (.md)、PDF (.pdf)、文本 (.txt)、Word (.doc, .docx)
          </p>
          <p style={{ color: "#666" }}>
            文件大小限制：50MB
          </p>
        </div>

        <Table
          columns={columns}
          dataSource={documents}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个文档`,
          }}
        />
      </Card>
    </div>
    </GlobalLayout>
  );
};

const KnowledgeManagePageWrapper = () => {
  return (
    <App>
      <KnowledgeManagePage />
    </App>
  );
};

export default KnowledgeManagePageWrapper;
