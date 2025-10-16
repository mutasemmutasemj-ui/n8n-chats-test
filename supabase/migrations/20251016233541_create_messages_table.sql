/*
  # إنشاء جدول الرسائل

  ## الجداول الجديدة
    - `messages`
      - `id` (uuid, primary key) - معرف الرسالة الفريد
      - `page_id` (text) - معرف الصفحة (page1, page2, إلخ)
      - `type` (text) - نوع الرسالة (text, audio, image, file)
      - `content` (text) - محتوى الرسالة
      - `sender` (text) - المرسل (user أو bot)
      - `file_name` (text, optional) - اسم الملف إذا كان الرسالة ملف
      - `file_size` (integer, optional) - حجم الملف بالبايت
      - `created_at` (timestamptz) - وقت إنشاء الرسالة

  ## الأمان
    - تفعيل RLS على جدول `messages`
    - السماح بالقراءة للجميع (public access للقراءة فقط)
    - السماح بالإضافة للجميع (public access للإضافة فقط)
    
  ## الفهارس
    - فهرس على `page_id` لتسريع البحث حسب الصفحة
    - فهرس على `created_at` لترتيب الرسائل
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text NOT NULL,
  type text NOT NULL,
  content text NOT NULL,
  sender text NOT NULL,
  file_name text,
  file_size integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON messages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_messages_page_id ON messages(page_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
