# 实时通讯客户端
## 项目简介
这是一款基于WebSocket的实时通讯客户端，采用Vue 3 + Element Plus构建，提供流畅的即时通讯体验。该应用支持私聊和群聊功能，具有现代化的UI界面和丰富的消息类型支持。

## 功能特性
### 用户管理
- ✅ 用户注册与登录
- ✅ 获取与修改用户信息
- ✅ 根据用户号码(number)查询用户信息
### 好友系统
- ✅ 添加好友
- ✅ 处理好友请求
- ✅ 查询好友列表
- ✅ 查询好友请求及数量
- ✅ 查询好友未读消息数量
### 群聊系统
- ✅ 创建群聊
- ✅ 申请加入群聊
- ✅ 处理群聊请求
- ✅ 查询群聊列表
- ✅ 根据群号码查询群聊信息
- ✅ 获取群成员信息
- ✅ 查询群聊请求及数量
- ✅ 查询群聊未读消息数量
### 消息功能
- ✅ 实时消息发送与接收
- ✅ 获取历史聊天记录
- ✅ 删除消息记录
- ✅ 文本、图片、视频等多种消息类型支持
### 文件传输
- ✅ 文件上传功能
- ✅ 大文件分片上传
## 技术栈
- 前端框架：Vue 3
- UI组件库：Element Plus
- 状态管理：Pinia
- 路由管理：Vue Router
- 网络请求：Axios
- 实时通信：WebSocket
- 构建工具：Vite

## 未来计划
### 用户管理增强
- 用户状态扩展（忙碌、离开、请勿打扰等） ✅
- 自定义状态消息（如"正在开会"、"学习中"） ✅
- 完善用户资料（生日、兴趣爱好、个性签名等） ✅
- 用户资料卡片查看和分享 
### 好友系统优化
- 好友分组管理（创建、编辑、删除分组） ✅
- 好友备注功能 ✅
- 好友黑名单功能 
- 好友星标和置顶功能 ✅
### 消息功能增强
- 语音消息支持  
- 视频消息功能 
- 联系人名片分享 
- 消息撤回功能 
- 消息转发功能 
- 消息收藏功能 
- 消息引用回复 
- 消息搜索功能 
- "输入中..."状态提示
- 聊天置顶功能 ✅
### 群聊系统完善 
- 群组角色系统（管理员、普通成员等）✅
- 群组权限管理 ✅
- 群组公告和置顶消息 ✅
- 批量管理群成员 ✅
- 群成员禁言功能 
- @特定成员功能
- 群消息精华收藏
- 群消息定时发送
### 文件传输优化
- 断点续传支持
- 传输速度限制选项
- 文件传输优先级设置
- 批量文件压缩传输
### WebSocket通信增强
- 心跳检测机制
- 自动重连功能
- 设备间消息同步
- "正在输入"状态实时显示
- 离线消息队列
- 消息缓存机制
### 跨功能模块增强
- 全局统一搜索（好友、群组、消息）
- 搜索历史记录
- 朋友圈/动态功能
