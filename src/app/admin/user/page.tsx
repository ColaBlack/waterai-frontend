'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Space, Modal, Form, Input, Select, Image, message, Card, Avatar, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import GlobalLayout from '@/components/GlobalLayout'
import { addUser, deleteUser, listUserByPage, updateUser } from '@/api/userService/userController'
import { USER_ROLE } from '@/lib/constants/roleEnums'

interface UserQueryParams {
  current: number
  pageSize: number
  userName?: string
}

export default function UserManagePage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<API.User[]>([])
  const [total, setTotal] = useState(0)
  const [searchParams, setSearchParams] = useState<UserQueryParams>({
    current: 1,
    pageSize: 10,
  })
  const [searchValue, setSearchValue] = useState('')

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<API.User | null>(null)

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  // 加载用户列表数据
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listUserByPage(searchParams)
      if (res.data.code === 200) {
        setData(res.data.data?.records || [])
        setTotal(res.data.data?.total || 0)
      } else {
        message.error(res.data.message || '数据加载失败')
      }
    } catch (error) {
      message.error('数据加载失败')
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    loadData()
  }, [loadData])

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchParams({
      ...searchParams,
      userName: value || undefined,
      current: 1,
    })
  }

  // 处理页码变化
  const handlePageChange = (page: number, pageSize: number) => {
    setSearchParams({
      ...searchParams,
      current: page,
      pageSize,
    })
  }

  // 处理新增用户
  const handleAddUser = async (values: API.UserAddRequest) => {
    try {
      const res = await addUser(values)
      if (res.data.code === 200) {
        message.success('新增用户成功')
        setAddModalVisible(false)
        addForm.resetFields()
        loadData()
      } else {
        message.error('新增用户失败: ' + res.data.message)
      }
    } catch (error) {
      message.error('新增用户失败')
    }
  }

  // 打开编辑对话框
  const handleEditClick = (record: API.User) => {
    setEditingUser(record)
    editForm.setFieldsValue({
      id: record.id,
      userName: record.userName,
      userAvatar: record.userAvatar,
      userProfile: record.userProfile,
      userRole: record.userRole,
    })
    setEditModalVisible(true)
  }

  // 处理编辑用户
  const handleEditUser = async (values: API.UserUpdateRequest) => {
    try {
      const res = await updateUser({ ...values, id: editingUser!.id! })
      if (res.data.code === 200) {
        message.success('修改用户成功')
        setEditModalVisible(false)
        editForm.resetFields()
        loadData()
      } else {
        message.error('修改用户失败: ' + res.data.message)
      }
    } catch (error) {
      message.error('修改用户失败')
    }
  }

  // 处理删除用户
  const handleDeleteUser = (record: API.User) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？这将无法恢复。',
      onOk: async () => {
        try {
          const res = await deleteUser({ id: record.id! })
          if (res.data.code === 200) {
            message.success('删除成功')
            loadData()
          } else {
            message.error(res.data.message || '删除失败')
          }
        } catch (error) {
          message.error('删除失败')
        }
      },
    })
  }

  // 表格列配置
  const columns: ColumnsType<API.User> = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户账号',
      dataIndex: 'userAccount',
      key: 'userAccount',
      width: 150,
    },
    {
      title: '用户昵称',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
    },
    {
      title: '用户头像',
      dataIndex: 'userAvatar',
      key: 'userAvatar',
      width: 100,
      render: (avatar: string) => (
        avatar ? <Avatar src={avatar} size={40} /> : <Avatar icon={<UserOutlined />} size={40} />
      ),
    },
    {
      title: '用户简介',
      dataIndex: 'userProfile',
      key: 'userProfile',
      ellipsis: true,
    },
    {
      title: '用户角色',
      dataIndex: 'userRole',
      key: 'userRole',
      width: 120,
      render: (role: string) => {
        const roleText = USER_ROLE[role as keyof typeof USER_ROLE] || '未知'
        const color = role === 'admin' ? 'red' : role === 'user' ? 'blue' : 'default'
        return <Tag color={color}>{roleText}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time: string) => time ? new Date(time).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditClick(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteUser(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <GlobalLayout>
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '24px' }}>用户管理</h1>

        {/* 搜索和操作栏 */}
        <Card style={{ marginBottom: '24px' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space.Compact size="large">
              <Input
                placeholder="搜索用户昵称"
                allowClear
                value={searchValue}
                onChange={(e) => {
                  const value = e.target.value
                  setSearchValue(value)
                  // 如果清空了输入框，立即触发搜索
                  if (!value) {
                    handleSearch('')
                  }
                }}
                onPressEnter={() => handleSearch(searchValue)}
                style={{ width: 320 }}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => handleSearch(searchValue)}
              >
                搜索
              </Button>
            </Space.Compact>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setAddModalVisible(true)}
            >
              新增用户
            </Button>
          </Space>
        </Card>

        {/* 用户列表表格 */}
        <Card>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            pagination={{
              current: searchParams.current,
              pageSize: searchParams.pageSize,
              total: total,
              showTotal: (total) => `共 ${total} 条记录`,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handlePageChange,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* 新增用户对话框 */}
        <Modal
          title="新增用户"
          open={addModalVisible}
          onCancel={() => {
            setAddModalVisible(false)
            addForm.resetFields()
          }}
          onOk={() => addForm.submit()}
          width={600}
        >
          <Form
            form={addForm}
            layout="vertical"
            onFinish={handleAddUser}
          >
            <Form.Item
              label="用户账号"
              name="userAccount"
              rules={[
                { required: true, message: '请输入用户账号' },
                { min: 4, message: '账号长度不能少于4位' },
                { max: 20, message: '账号长度不能超过20位' },
                { pattern: /^[a-zA-Z0-9]+$/, message: '账号只能包含字母和数字' }
              ]}
            >
              <Input placeholder="请输入用户账号" />
            </Form.Item>

            <Form.Item
              label="用户昵称"
              name="userName"
              rules={[{ required: true, message: '请输入用户昵称' }]}
            >
              <Input placeholder="请输入用户昵称" />
            </Form.Item>

            <Form.Item
              label="用户头像"
              name="userAvatar"
            >
              <Input placeholder="请输入头像URL" />
            </Form.Item>

            <Form.Item
              label="用户角色"
              name="userRole"
              initialValue="user"
              rules={[{ required: true, message: '请选择用户角色' }]}
            >
              <Select>
                <Select.Option value="user">普通用户</Select.Option>
                <Select.Option value="admin">管理员</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* 编辑用户对话框 */}
        <Modal
          title="编辑用户"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false)
            editForm.resetFields()
          }}
          onOk={() => editForm.submit()}
          width={600}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditUser}
          >
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="用户昵称"
              name="userName"
              rules={[{ required: true, message: '请输入用户昵称' }]}
            >
              <Input placeholder="请输入用户昵称" />
            </Form.Item>

            <Form.Item
              label="用户头像"
              name="userAvatar"
            >
              <Input placeholder="请输入头像URL" />
            </Form.Item>

            <Form.Item
              label="用户简介"
              name="userProfile"
            >
              <Input.TextArea rows={4} placeholder="请输入用户简介" />
            </Form.Item>

            <Form.Item
              label="用户角色"
              name="userRole"
              rules={[{ required: true, message: '请选择用户角色' }]}
            >
              <Select>
                <Select.Option value="user">普通用户</Select.Option>
                <Select.Option value="admin">管理员</Select.Option>
                <Select.Option value="ban">封禁用户</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </GlobalLayout>
  )
}

