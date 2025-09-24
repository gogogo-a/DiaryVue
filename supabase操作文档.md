# Supabase 存储服务使用文档

## 目录

1. [概述](#概述)
2. [存储桶说明](#存储桶说明)
3. [存储路径规范](#存储路径规范)
4. [API 函数使用](#api-函数使用)
5. [使用示例](#使用示例)
6. [安全建议](#安全建议)
7. [错误处理](#错误处理)
8. [最佳实践](#最佳实践)

## 概述

本文档描述了如何使用 Supabase 存储服务来上传和管理文件，特别是针对不同类型的文件（日记图片、日记视频、账单图片、头像等）采用不同的路径策略。

## 存储桶说明

我们使用两个主要的存储桶来存储不同类型的文件：

1. **diary_image** - 用于存储所有图片类型的文件
2. **diary_video** - 用于存储所有视频类型的文件

## 存储路径规范

为了有效组织和管理用户上传的文件，我们采用以下路径命名规范：

```
{用户UUID}/{文件类型}/{文件名}
```

### 用户UUID

- 每个用户的文件都应该存储在以其UUID命名的文件夹下
- 这确保了不同用户的文件相互隔离
- 用户UUID应从用户认证系统获取

### 文件类型

文件应根据其用途分类存储在以下子文件夹中：

#### 图片存储桶 (diary_image)

| 文件类型 | 文件夹名称 | 描述 |
|---------|----------|------|
| 用户头像 | `avatars` | 用户的个人头像图片 |
| 日记图片 | `diary_images` | 与日记相关的图片 |
| 账单图片 | `bill_images` | 与账单相关的收据、票据等图片 |
| 日程图片 | `schedule_images` | 与日程相关的图片 |
| 其他附件 | `attachments` | 其他类型的图片附件 |

#### 视频存储桶 (diary_video)

| 文件类型 | 文件夹名称 | 描述 |
|---------|----------|------|
| 日记视频 | `diary_videos` | 与日记相关的视频 |
| 账单视频 | `bill_videos` | 与账单相关的视频证明 |
| 日程视频 | `schedule_videos` | 与日程相关的视频 |
| 其他视频 | `other_videos` | 其他类型的视频文件 |

### 文件名

- 文件名应包含时间戳以确保唯一性
- 推荐格式：`{时间戳}_{随机字符串}.{扩展名}`
- 例如：`1632145789_a7b3c9.jpg` 或 `1632145789_a7b3c9.mp4`

## API 函数使用

### 上传文件

我们使用 `uploadFileToSupabase` 函数来上传文件到 Supabase 存储：

```javascript
/**
 * 上传文件到Supabase Storage
 * @param {Object} options 上传选项
 * @param {string} options.bucket 存储桶名称 ('diary_image' 或 'diary_video')
 * @param {string} options.filePath 本地文件路径
 * @param {string} options.fileName 文件名称（可选，默认使用原文件名）
 * @param {string} options.folder 存储文件夹路径（可选）
 * @param {Function} options.onProgress 上传进度回调（可选）
 * @returns {Promise<Object>} 上传结果
 */
const result = await uploadFileToSupabase({
  bucket: 'diary_image', // 或 'diary_video'
  filePath: '/path/to/local/file.jpg',
  folder: 'user123/diary_images',
  onProgress: (progress) => {
    console.log(`上传进度: ${progress}%`);
  }
});
```

### 获取文件列表

使用 `listFilesFromSupabase` 函数获取存储桶中的文件列表：

```javascript
/**
 * 获取存储桶中的文件列表
 * @param {Object} options 选项
 * @param {string} options.bucket 存储桶名称
 * @param {string} options.folder 文件夹路径（可选）
 * @returns {Promise<Object>} 文件列表
 */
const result = await listFilesFromSupabase({
  bucket: 'diary_image',
  folder: 'user123/diary_images'
});
```

## 使用示例

### 上传用户头像 (图片存储桶)

```javascript
const uploadAvatar = async (userUUID, filePath) => {
  const result = await uploadFileToSupabase({
    bucket: 'diary_image',
    filePath: filePath,
    folder: `${userUUID}/avatars`,
    // 可选：指定文件名
    fileName: `avatar_${Date.now()}.jpg`
  });
  
  return result;
};
```

### 上传日记图片 (图片存储桶)

```javascript
const uploadDiaryImage = async (userUUID, diaryId, filePath) => {
  const result = await uploadFileToSupabase({
    bucket: 'diary_image',
    filePath: filePath,
    folder: `${userUUID}/diary_images/${diaryId}`,
    // 使用默认的文件名生成
  });
  
  return result;
};
```

### 上传账单图片 (图片存储桶)

```javascript
const uploadBillImage = async (userUUID, billId, filePath) => {
  const result = await uploadFileToSupabase({
    bucket: 'diary_image',
    filePath: filePath,
    folder: `${userUUID}/bill_images/${billId}`,
    // 使用默认的文件名生成
  });
  
  return result;
};
```

### 上传日记视频 (视频存储桶)

```javascript
const uploadDiaryVideo = async (userUUID, diaryId, filePath) => {
  const result = await uploadFileToSupabase({
    bucket: 'diary_video',
    filePath: filePath,
    folder: `${userUUID}/diary_videos/${diaryId}`,
    // 使用默认的文件名生成
    onProgress: (progress) => {
      console.log(`视频上传进度: ${progress}%`);
    }
  });
  
  return result;
};
```

### 上传账单相关视频 (视频存储桶)

```javascript
const uploadBillVideo = async (userUUID, billId, filePath) => {
  const result = await uploadFileToSupabase({
    bucket: 'diary_video',
    filePath: filePath,
    folder: `${userUUID}/bill_videos/${billId}`,
    // 使用默认的文件名生成
  });
  
  return result;
};
```

## 获取文件URL

上传成功后，可以通过以下方式构建公共访问URL：

```javascript
const getPublicUrl = (bucket, path) => {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};

// 示例
const imageUrl = getPublicUrl('diary_image', 'user123/diary_images/1632145789_a7b3c9.jpg');
const videoUrl = getPublicUrl('diary_video', 'user123/diary_videos/1632145789_a7b3c9.mp4');
```

## 安全建议

1. **访问控制**：
   - 为不同类型的文件设置适当的访问权限
   - 用户头像可能需要公开访问
   - 日记图片、视频和账单图片应该只对文件所有者可见

2. **文件验证**：
   - 验证文件类型和大小
   - 限制允许的文件扩展名
   - 设置最大文件大小限制
   - 图片存储桶只允许图片格式（jpg, png, gif, webp等）
   - 视频存储桶只允许视频格式（mp4, mov, avi等）

3. **定期清理**：
   - 实施策略删除未使用的文件
   - 当用户删除相关内容时，同步删除存储的文件

## 错误处理

上传失败时，应检查以下常见问题：

1. 存储桶权限设置
2. API密钥是否正确
3. 文件大小是否超出限制
4. 网络连接问题
5. 文件类型是否与存储桶匹配（图片到图片桶，视频到视频桶）

## 最佳实践

1. **批量上传**：对于需要上传多个文件的场景，使用批量上传以提高效率
2. **进度反馈**：为大文件上传（特别是视频）提供进度反馈
3. **缓存策略**：实施适当的缓存策略以减少重复下载
4. **文件优化**：
   - 上传前压缩图片以节省存储空间和带宽
   - 考虑为视频生成缩略图，便于预览
5. **命名规范**：严格遵循文件夹命名规范，确保文件组织清晰

通过遵循这些指南，您可以有效地组织和管理用户上传的文件，确保系统的可扩展性和安全性。
