export default [{
  requestLibPath: "import request from '@/lib/utils/request'",
  schemaPath: 'http://localhost:8115/chat-service/v3/api-docs',
  serversPath: './src/lib/api/chatService'
},{
  requestLibPath: "import request from '@/lib/utils/request'",
  schemaPath: 'http://localhost:8115/imgbed-service/v3/api-docs',
  serversPath: './src/lib/api/imgBedService'
},{
  requestLibPath: "import request from '@/lib/utils/request'",
  schemaPath: 'http://localhost:8115/user-service/v3/api-docs',
  serversPath: './src/lib/api/userService'
}]