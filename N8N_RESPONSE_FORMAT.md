# صيغة الرد المتوقعة من n8n

عندما يرسل المستخدم رسالة إلى webhook الخاص بـ n8n، يجب أن يكون الرد بالصيغة التالية:

## 1. رد نصي (Text)

```json
{
  "type": "text",
  "content": "هذا رد نصي من البوت",
  "message": "يمكن استخدام message بدلاً من content"
}
```

أو ببساطة:

```json
{
  "message": "هذا رد نصي"
}
```

إذا لم يتم تحديد `type`، سيتم اعتبار الرد نصياً تلقائياً.

---

## 2. رد صورة (Image)

```json
{
  "type": "image",
  "content": "https://example.com/image.jpg"
}
```

أو مع رسالة نصية مرفقة:

```json
{
  "type": "image",
  "content": "https://example.com/image.jpg",
  "message": "إليك الصورة المطلوبة"
}
```

**ملاحظة:** يجب أن يكون `content` عبارة عن رابط URL مباشر للصورة.

---

## 3. رد صوتي (Audio)

```json
{
  "type": "audio",
  "content": "https://example.com/audio.mp3"
}
```

**الصيغ المدعومة:**
- MP3 (audio/mpeg)
- WAV (audio/wav)
- WebM (audio/webm)

**ملاحظة:** يجب أن يكون `content` عبارة عن رابط URL مباشر للملف الصوتي.

---

## 4. رد فيديو (Video)

```json
{
  "type": "video",
  "content": "https://example.com/video.mp4"
}
```

**الصيغ المدعومة:**
- MP4 (video/mp4)
- WebM (video/webm)

**ملاحظة:** يجب أن يكون `content` عبارة عن رابط URL مباشر للفيديو.

---

## 5. رد بملف (File)

```json
{
  "type": "file",
  "content": "{\"name\":\"document.pdf\",\"type\":\"application/pdf\",\"size\":1024000,\"data\":\"data:application/pdf;base64,JVBERi0xLjQK...\"}"
}
```

**ملاحظة:** الـ `content` يجب أن يكون JSON string يحتوي على:
- `name`: اسم الملف
- `type`: نوع MIME
- `size`: حجم الملف بالبايت
- `data`: البيانات بصيغة base64 أو URL

---

## أمثلة عملية في n8n

### مثال 1: رد نصي بسيط

في node "Respond to Webhook":

```json
{
  "type": "text",
  "content": "مرحباً! كيف يمكنني مساعدتك؟"
}
```

### مثال 2: رد بصورة من API

```json
{
  "type": "image",
  "content": "{{$json.imageUrl}}"
}
```

### مثال 3: رد بفيديو

```json
{
  "type": "video",
  "content": "https://cdn.example.com/videos/tutorial.mp4"
}
```

### مثال 4: رد بملف صوتي

```json
{
  "type": "audio",
  "content": "https://cdn.example.com/audio/voice-message.mp3"
}
```

---

## البيانات المرسلة إلى n8n من التطبيق

عند إرسال رسالة من المستخدم، يتم إرسال البيانات التالية إلى webhook:

```json
{
  "message": "محتوى الرسالة",
  "type": "text",
  "timestamp": "2025-10-17T00:00:00.000Z",
  "pageId": "page1"
}
```

حيث:
- `message`: محتوى الرسالة (نص، أو base64 للصور/ملفات)
- `type`: نوع الرسالة (text, audio, image, file, video)
- `timestamp`: وقت إرسال الرسالة
- `pageId`: معرف الصفحة (page1, page2, إلخ)

---

## ملاحظات مهمة

1. **الروابط يجب أن تكون HTTPS**: لضمان الأمان والتوافق مع المتصفحات الحديثة.

2. **CORS**: تأكد من أن السيرفر الذي يستضيف الملفات يسمح بـ CORS للوصول للملفات.

3. **حجم الملفات**: انتبه لحجم الملفات المرسلة، خاصة الفيديوهات.

4. **Fallback**: إذا لم يكن هناك `type` محدد، سيتم التعامل مع الرد كنص.

5. **Error Handling**: في حالة الخطأ، سيتم عرض رسالة خطأ تلقائية للمستخدم.
