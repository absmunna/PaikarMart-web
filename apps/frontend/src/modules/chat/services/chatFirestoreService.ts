import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  setDoc,
  getDoc,
  getDocs,
  updateDoc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/core/lib/firebase';

export interface ParticipantInfo {
  name: string;
  avatar?: string;
  role?: string;
  isVerified?: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  participantDetails: Record<string, ParticipantInfo>;
  lastMessage: string;
  lastMessageTimestamp?: Timestamp | Date | any;
  unreadCounts?: Record<string, number>;
  relatedProductId?: string;
  relatedProductName?: string;
  relatedOrderId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ChatMessageItem {
  id: string;
  chatId: string;
  senderId: string;
  senderName?: string;
  text: string;
  imageUrl?: string;
  timestamp?: Timestamp | Date | any;
  status?: 'sent' | 'delivered' | 'read';
}

/**
 * Subscribe to all chats where the user is a participant in real-time
 */
export function subscribeUserChats(
  userId: string,
  onUpdate: (chats: ChatConversation[]) => void,
  onError?: (err: any) => void
) {
  if (!userId) {
    onUpdate([]);
    return () => {};
  }

  try {
    const chatsCol = collection(db, 'chats');
    const q = query(
      chatsCol,
      where('participants', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const conversations: ChatConversation[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            participants: data.participants || [],
            participantDetails: data.participantDetails || {},
            lastMessage: data.lastMessage || '',
            lastMessageTimestamp: data.lastMessageTimestamp,
            unreadCounts: data.unreadCounts || {},
            relatedProductId: data.relatedProductId,
            relatedProductName: data.relatedProductName,
            relatedOrderId: data.relatedOrderId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        // Sort descending by timestamp
        conversations.sort((a, b) => {
          const timeA = a.lastMessageTimestamp?.toMillis?.() || (a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0);
          const timeB = b.lastMessageTimestamp?.toMillis?.() || (b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0);
          return timeB - timeA;
        });

        onUpdate(conversations);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'chats');
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'chats');
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Subscribe to messages in a specific chat in real-time
 */
export function subscribeChatMessages(
  chatId: string,
  onUpdate: (messages: ChatMessageItem[]) => void,
  onError?: (err: any) => void
) {
  if (!chatId) {
    onUpdate([]);
    return () => {};
  }

  try {
    const messagesCol = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCol, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessageItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            chatId,
            senderId: data.senderId,
            senderName: data.senderName,
            text: data.text || '',
            imageUrl: data.imageUrl,
            timestamp: data.timestamp,
            status: data.status || 'read',
          };
        });
        onUpdate(msgs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `chats/${chatId}/messages`);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `chats/${chatId}/messages`);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Send a new message to a conversation
 */
export async function sendChatMessage(
  chatId: string,
  data: {
    senderId: string;
    senderName?: string;
    text: string;
    imageUrl?: string;
  }
): Promise<string> {
  const messagesCol = collection(db, 'chats', chatId, 'messages');
  const chatRef = doc(db, 'chats', chatId);

  try {
    const docRef = await addDoc(messagesCol, {
      senderId: data.senderId,
      senderName: data.senderName || 'Anonymous',
      text: data.text,
      imageUrl: data.imageUrl || null,
      timestamp: serverTimestamp(),
      status: 'sent',
    });

    // Update parent chat document with latest message and timestamp
    await updateDoc(chatRef, {
      lastMessage: data.text || (data.imageUrl ? '[ছবি]' : ''),
      lastMessageTimestamp: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch(async () => {
      // If update fails (e.g. document doesn't exist yet), set with merge
      await setDoc(chatRef, {
        lastMessage: data.text,
        lastMessageTimestamp: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    });

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `chats/${chatId}/messages`);
    throw error;
  }
}

/**
 * Retrieve or create a conversation between buyer and seller
 */
export async function getOrCreateConversation(
  buyer: { id: string; name: string; avatar?: string; role?: string },
  seller: { id: string; name: string; avatar?: string; role?: string },
  context?: { productId?: string; productName?: string; orderId?: string }
): Promise<string> {
  // Deterministic chat ID based on participant IDs for 1-to-1 conversations if no specific order
  const sortedIds = [buyer.id, seller.id].sort();
  const canonicalId = `chat_${sortedIds[0]}_${sortedIds[1]}`;

  const chatRef = doc(db, 'chats', canonicalId);

  try {
    const existing = await getDoc(chatRef);
    if (existing.exists()) {
      // If new product context provided, update it
      if (context?.productId || context?.orderId) {
        await updateDoc(chatRef, {
          ...(context.productId ? { relatedProductId: context.productId } : {}),
          ...(context.productName ? { relatedProductName: context.productName } : {}),
          ...(context.orderId ? { relatedOrderId: context.orderId } : {}),
          updatedAt: serverTimestamp(),
        }).catch(() => {});
      }
      return canonicalId;
    }

    // Create new conversation
    const newChatData: Partial<ChatConversation> = {
      participants: [buyer.id, seller.id],
      participantDetails: {
        [buyer.id]: {
          name: buyer.name || 'Buyer',
          avatar: buyer.avatar || '',
          role: buyer.role || 'buyer',
          isVerified: true,
        },
        [seller.id]: {
          name: seller.name || 'Wholesale Seller',
          avatar: seller.avatar || '',
          role: seller.role || 'seller',
          isVerified: true,
        },
      },
      lastMessage: context?.productName 
        ? `ইনকোয়ারি: ${context.productName}` 
        : 'চ্যাট শুরু হয়েছে',
      lastMessageTimestamp: serverTimestamp(),
      unreadCounts: {
        [buyer.id]: 0,
        [seller.id]: 1,
      },
      relatedProductId: context?.productId || undefined,
      relatedProductName: context?.productName || undefined,
      relatedOrderId: context?.orderId || undefined,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(chatRef, newChatData);
    return canonicalId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `chats/${canonicalId}`);
    throw error;
  }
}

/**
 * Fetch details of a single conversation
 */
export async function getConversation(chatId: string): Promise<ChatConversation | null> {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const snap = await getDoc(chatRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as ChatConversation;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `chats/${chatId}`);
    return null;
  }
}
