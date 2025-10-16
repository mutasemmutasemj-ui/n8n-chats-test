import { supabase } from '../lib/supabase';
import { Message } from '../types/chat';

export const saveMessage = async (message: Omit<Message, 'id'>, pageId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        page_id: pageId,
        type: message.type,
        content: message.content,
        sender: message.sender,
        file_name: message.fileName,
        file_size: message.fileSize,
        created_at: message.timestamp.toISOString(),
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
};

export const loadMessages = async (pageId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((row) => ({
      id: row.id,
      type: row.type,
      content: row.content,
      sender: row.sender,
      timestamp: new Date(row.created_at),
      fileName: row.file_name,
      fileSize: row.file_size,
    }));
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
};
