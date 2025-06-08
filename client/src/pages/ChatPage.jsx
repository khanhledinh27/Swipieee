import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Chat from '../components/Chat';

const ChatPage = () => {
  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-rose-50 overflow-hidden'>
      <Sidebar />
      <div className='flex-grow flex flex-col overflow-hidden'>
        <Header />
        <main className='flex-grow flex flex-col p-4 relative overflow-hidden'>
          <Chat />
        </main>
      </div>
    </div>
  );
};

export default ChatPage;