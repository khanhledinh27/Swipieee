import { useMessageStore } from '../store/useMessageStore';
import { useAuthStore } from '../store/useAuthStore';
import Header from '../components/Header';
import { useMatchStore } from '../store/useMatchStore';
import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserX, Loader, Check, CheckCheck, Clock } from 'lucide-react';
import MessageInput from '../components/MessageInput';

const ChatPage = () => {
  const {
    messages,
    getMessages,
    subscribeToMessages,
    unSubscribeFromMessages,
    setCurrentChatUserId,
    updateMessageStatus
  } = useMessageStore();
  const { authUser } = useAuthStore();
  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const { id } = useParams();
  const match = matches.find(m => m?._id === id);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mark messages as delivered when chat is opened
  useEffect(() => {
    if (authUser && id && messages.length > 0) {
      const undeliveredMessages = messages.filter(
        msg => msg.receiver === authUser._id && msg.status === 'sent'
      );
      
      if (undeliveredMessages.length > 0) {
        undeliveredMessages.forEach(msg => {
          updateMessageStatus(msg._id, 'delivered');
        });
      }
    }
  }, [authUser, id, messages, updateMessageStatus]);

  // Mark messages as seen when user views them
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && authUser && id && messages.length > 0) {
        const unseenMessages = messages.filter(
          msg => msg.receiver === authUser._id && msg.status === 'delivered'
        );
        
        if (unseenMessages.length > 0) {
          unseenMessages.forEach(msg => {
            updateMessageStatus(msg._id, 'seen');
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authUser, id, messages, updateMessageStatus]);

  useEffect(() => {
    if (authUser && id) {
      getMyMatches();
      getMessages(id);
      subscribeToMessages();
    }
    return () => {
      unSubscribeFromMessages();
    };
  }, [authUser, id, getMyMatches, getMessages, subscribeToMessages, unSubscribeFromMessages]);
  
  useEffect(() => {
    if (id) setCurrentChatUserId(id);
    return () => setCurrentChatUserId(null);
  }, [id, setCurrentChatUserId]);

  if (isLoadingMyMatches) return <LoadingMessagesUI />;
  if (!match) return <MatchNotFound />;
  
  return (
    <div className='flex flex-col h-screen bg-blue-50 bg-opacity-50'>
      <Header />

      <div className='flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full'>
        <div className='flex items-center bg-white rounded-lg shadow p-3 mb-4 border-l-4 border-blue-400'>
          <img 
            src={match.profilePicture || "/avatar.png"}
            className='w-12 h-12 object-cover rounded-full mr-3 border-2 border-blue-300' 
            alt={match.name}
          />
          <h2 className='text-xl font-semibold text-gray-800'>{match.name}</h2>
        </div>

        <div className='flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4'>
          {messages.length === 0 ? (
            <p className='text-center text-gray-500'>Start your conversation with {match.name}</p>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={msg._id || idx}
                className={`mb-3 ${msg.sender === authUser._id ? "text-right" : "text-left"}`}
              >
                <div className={`inline-flex flex-col max-w-xs lg:max-w-md ${
                  msg.sender === authUser._id ? "items-end" : "items-start"
                }`}>
                  <span className={`inline-block p-3 rounded-lg ${
                    msg.sender === authUser._id
                      ? "bg-rose-500 text-white rounded-tr-none"
                      : "bg-blue-100 text-blue-800 rounded-tl-none"
                  }`}>
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  </span>
                  
                  {/* Enhanced status row */}
                  <div className={`flex items-center mt-1 ${
                    msg.sender === authUser._id ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs text-gray-500 mr-2">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    {msg.sender === authUser._id && (
                      <div className="relative group flex items-center">
                        {msg.status === 'sent' && (
                          <>
                            <Clock size={14} className="text-gray-400" />
                            <div className="absolute hidden group-hover:block bottom-full mb-1 right-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                              Sent
                            </div>
                          </>
                        )}
                        {msg.status === 'delivered' && (
                          <>
                            <CheckCheck size={14} className="text-gray-400" />
                            <div className="absolute hidden group-hover:block bottom-full mb-1 right-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                              Delivered
                            </div>
                          </>
                        )}
                        {msg.status === 'seen' && (
                          <>
                            <CheckCheck size={14} className="text-blue-400" />
                            <div className="absolute hidden group-hover:block bottom-full mb-1 right-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                              Seen
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput match={match} />
      </div>
    </div>
  );
};

const MatchNotFound = () => (
  <div className='h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50 bg-dot-pattern'>
    <div className='bg-white p-8 rounded-lg shadow-md text-center'>
      <UserX size={64} className="mx-auto text-blue-500 mb-4" />
      <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Match Not Found</h2>
      <p className='text-gray-600'>The match you are looking for does not exist.</p>
      <Link 
        to='/' 
        className='mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 inline-block'
      >
        Go back to Home Page
      </Link>
    </div>
  </div>
);

const LoadingMessagesUI = () => (
  <div className='h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50'>
    <div className='bg-white p-8 rounded-lg shadow-md text-center'>
      <Loader size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
      <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Loading Chat</h2>
      <p className='text-gray-600'>Please wait a sec...</p>
      <div className='mt-6 flex justify-center space-x-2'>
        <div 
          className='w-3 h-3 bg-blue-500 rounded-full animate-bounce' 
          style={{ animationDelay: '0s' }}
        />
        <div 
          className='w-3 h-3 bg-blue-500 rounded-full animate-bounce'
          style={{ animationDelay: '0.2s' }}
        />
        <div 
          className='w-3 h-3 bg-blue-500 rounded-full animate-bounce'
          style={{ animationDelay: '0.4s' }}
        />
      </div>
    </div>
  </div>
);

export default ChatPage;