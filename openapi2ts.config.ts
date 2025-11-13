export default [{
  requestLibPath: "import request from '@/lib/utils/request'",
  schemaPath: 'http://localhost:8115/chat-service/v3/api-docs',
  serversPath: './src/api/chatService'
},{
  requestLibPath: "import request from '@/lib/utils/request'",
  schemaPath: 'http://localhost:8115/data-service/v3/api-docs',
  serversPath: './src/api/dataService'
},{
  requestLibPath: "import request from '@/lib/utils/request'",
  schemaPath: 'http://localhost:8115/user-service/v3/api-docs',
  serversPath: './src/api/userService'
}]