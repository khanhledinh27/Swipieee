import { useRef, useEffect } from 'react';
import { useMessageStore } from '../store/useMessageStore';
import { useAuthStore } from '../store/useAuthStore';
import { useMatchStore } from '../store/useMatchStore';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserX, Loader, Clock, CheckCheck } from 'lucide-react';
import MessageInput from '../components/MessageInput';

const Chat = () => {
  const { messages, getMessages, subscribeToMessages, unSubscribeFromMessages,
    setCurrentChatUserId, updateMessageStatus } = useMessageStore();
  const { authUser } = useAuthStore();
  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const { id } = useParams();
  const match = matches.find(m => m?._id === id);
  
  const messagesEndRef = useRef(null);
  const observerRef = useRef(null);

  // Auto-scroll to bottom and set up Intersection Observer
  useEffect(() => {
    scrollToBottom();
    
    if (!authUser || !id || messages.length === 0) return;

    const observer = new IntersectionObserver(
      //DOM elements that are intersecting
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id');
            const message = messages.find(msg => msg._id === messageId);

            if (message && 
                message.receiver === authUser._id && 
                message.status === 'delivered') {
              updateMessageStatus(message._id, 'seen');
            }
          }
        });
      },
      { threshold: 0.5 } // 50% of message must be visible
    );

    observerRef.current = observer;

    // Observe all messages
    document.querySelectorAll('[data-message-id]').forEach(el => {
      observer.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [authUser, id, messages, updateMessageStatus]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mark messages as delivered when chat is opened
  useEffect(() => {
    if (authUser && id && messages.length > 0) {
      const undeliveredMessages = messages.filter(
        msg => msg.receiver === authUser._id && 
               msg.sender === id && 
               msg.status === 'sent'
      );
      
      if (undeliveredMessages.length > 0) {
        undeliveredMessages.forEach(msg => {
          updateMessageStatus(msg._id, 'delivered');
        });
      }
    }
  }, [authUser, id, messages, updateMessageStatus]);

  useEffect(() => {
    if (authUser && id) {
      getMyMatches();
      getMessages(id);
      subscribeToMessages();
    }
    return () => {
      unSubscribeFromMessages();
    }
  }, [authUser, id, getMyMatches, getMessages, subscribeToMessages, unSubscribeFromMessages]);
  
  useEffect(() => {
    if (id) setCurrentChatUserId(id);
    return () => setCurrentChatUserId(null);
  }, [id, setCurrentChatUserId]);

  if (isLoadingMyMatches) return <LoadingMessagesUI />;
  if (!match) return <MatchNotFound />;
  
  return (
    <div className='flex-grow flex flex-col h-full overflow-hidden'>
      {/* Header with recipient info */}
      <div className='flex items-center bg-white rounded-lg shadow p-3 mb-4 border-l-4 border-blue-400'>
        <img 
          src={match.profilePicture || "/avatar.png"}
          className='w-12 h-12 object-cover rounded-full mr-3 border-2 border-blue-300' 
          alt={match.name}
        />
        <h2 className='text-xl font-semibold text-gray-800'>{match.name}</h2>
      </div>
      
      {/* Messages container */}
      <div 
        className='flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4'
        style={{ 
          maxHeight: 'calc(100vh - 280px)',
          minHeight: '200px'
        }}
      >
        {messages.length === 0 ? (
          <div className='h-full flex items-center justify-center'>
            <p className='text-center text-gray-500'>Bắt đầu cuộc trò chuyền với {match.name}</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={msg._id || idx}
              data-message-id={msg._id}
              className={`mb-3 ${msg.sender === authUser._id ? "text-right" : "text-left"}`}
            >
              <span className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                msg.sender === authUser._id
                  ? "bg-rose-500 text-white"
                  : "bg-blue-100 text-blue-800"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
              </span>
              <div className={`flex items-center mt-1 ${
                    msg.sender === authUser._id ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs text-gray-500 mr-2">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.sender === authUser._id && (
                      <div className="relative group flex items-center">
                        {msg.status === 'sent' && <Clock size={14} className="text-gray-400" />}
                        {msg.status === 'delivered' && <CheckCheck size={14} className="text-gray-400" />}
                        {msg.status === 'seen' && <CheckCheck size={14} className="text-blue-400" />}
                      </div>
                    )}
                </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className='mt-auto'>
        <MessageInput match={match} onSend={scrollToBottom} />
      </div>
    </div>
  );
};

const MatchNotFound = () => (
  <div className='h-full flex flex-col items-center justify-center bg-gray-100 bg-opacity-50 bg-dot-pattern'>
    <div className='bg-white p-8 rounded-lg shadow-md text-center'>
      <UserX size={64} className="mx-auto text-blue-500 mb-4" />
      <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Không tìm thấy</h2>
      <p className='text-gray-600'>Người bạn ghép đôi hiện không tìm thấy!</p>
      <Link 
        to='/' 
        className='mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 inline-block'
      >
        Trở về trang chủ
      </Link>
    </div>
  </div>
);

const LoadingMessagesUI = () => (
  <div className='h-full flex flex-col items-center justify-center bg-gray-100 bg-opacity-50'>
    <div className='bg-white p-8 rounded-lg shadow-md text-center'>
      <Loader size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
      <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Đang tải tin nhắn</h2>
      <p className='text-gray-600'>Vui lòng đợi trong ít giây...</p>
      <div className='mt-6 flex justify-center space-x-2'>
        <div className='w-3 h-3 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '0s' }} />
        <div className='w-3 h-3 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }} />           
        <div className='w-3 h-3 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '0.4s' }} />           
      </div>
    </div>
  </div>
);

export default Chat;