"use client";

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Spin, App, Progress } from "antd";
import {
  UserOutlined,
  MessageOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import GlobalLayout from "@/components/GlobalLayout";
import { getStatistics } from "@/lib/api/chatService/api/statisticsController";

const StatisticsPage: React.FC = () => {
  const { message } = App.useApp();
  const [statistics, setStatistics] = useState<API.StatisticsVO | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await getStatistics();

      if (response.data.code === 200) {
        setStatistics(response.data.data);
      } else {
        message.error(response.data.message || "获取统计信息失败");
      }
    } catch (error) {
      console.error("获取统计信息失败:", error);
      message.error("获取统计信息失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchStatistics();
      const interval = setInterval(fetchStatistics, 60000);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  if (loading && !statistics) {
    return (
      <GlobalLayout>
        <div style={{ padding: "24px", textAlign: "center" }}>
          <Spin size="large">
            <div style={{ marginTop: 20 }}>加载统计数据中...</div>
          </Spin>
        </div>
      </GlobalLayout>
    );
  }

  const totalChatRooms = (statistics?.totalChatRooms || 0) + (statistics?.totalVisionChatRooms || 0);
  const todayNewChatRooms = (statistics?.todayNewChatRooms || 0) + (statistics?.todayNewVisionChatRooms || 0);

  return (
    <GlobalLayout>
      <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "calc(100vh - 64px)" }}>
      <h1 style={{ marginBottom: 24 }}>系统统计</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={statistics?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日新增用户"
              value={statistics?.todayNewUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总对话室数"
              value={totalChatRooms}
              prefix={<MessageOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日新增对话室"
              value={todayNewChatRooms}
              prefix={<MessageOutlined />}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="文本对话室"
              value={statistics?.totalChatRooms || 0}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="视觉对话室"
              value={statistics?.totalVisionChatRooms || 0}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="知识库文档"
              value={statistics?.totalKnowledgeBase || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日新增文档"
              value={statistics?.todayNewKnowledgeBase || 0}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="对话类型分布" variant="outlined">
            <div style={{ padding: "20px 0" }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="文本对话"
                    value={statistics?.totalChatRooms || 0}
                    prefix={<MessageOutlined />}
                    suffix="个"
                    valueStyle={{ color: "#3f8600" }}
                  />
                  <Progress
                    percent={totalChatRooms ? Math.round(((statistics?.totalChatRooms || 0) / totalChatRooms) * 100) : 0}
                    strokeColor="#3f8600"
                    showInfo={false}
                    style={{ marginTop: 8 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="视觉对话"
                    value={statistics?.totalVisionChatRooms || 0}
                    prefix={<MessageOutlined />}
                    suffix="个"
                    valueStyle={{ color: "#722ed1" }}
                  />
                  <Progress
                    percent={totalChatRooms ? Math.round(((statistics?.totalVisionChatRooms || 0) / totalChatRooms) * 100) : 0}
                    strokeColor="#722ed1"
                    showInfo={false}
                    style={{ marginTop: 8 }}
                  />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="今日新增统计" variant="outlined">
            <div style={{ padding: "20px 0" }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="新增用户"
                    value={statistics?.todayNewUsers || 0}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="新增对话室"
                    value={todayNewChatRooms}
                    prefix={<MessageOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="新增文档"
                    value={statistics?.todayNewKnowledgeBase || 0}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 16, textAlign: "center", color: "#999" }}>
        <p>📊 数据每分钟自动刷新 | 最后更新: {new Date().toLocaleString("zh-CN")}</p>
      </div>
    </div>
    </GlobalLayout>
  );
};

const StatisticsPageWrapper = () => {
  return (
    <App>
      <StatisticsPage />
    </App>
  );
};

export default StatisticsPageWrapper;
