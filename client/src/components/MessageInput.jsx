import { useRef, useState } from "react"
import { useMessageStore } from "../store/useMessageStore"
import { useEffect } from "react"
import { Smile, Send } from "lucide-react"
import EmojiPicker from "emoji-picker-react"

const MessageInput = ({match}) => {
    const [message, setMessage] = useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const emojiPickerRef = useRef(null)
    const {sendMessage} = useMessageStore()

    const handleSendMessage = (e) => {
        e.preventDefault()
        if(message.trim()){
            sendMessage(match._id, message)
            setMessage("")
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    
    return <form onSubmit={handleSendMessage} className="flex relative">
            <button type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400
            hover:text-blue-500 focus:outline-none">
                <Smile size={24} />
            </button>

            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} 
            className="flex-grow p-3 pl-12 rounded-l-lg border-2 border-blue-500
            focus:outline-none focus:ring-2 focus:ring-blue-300" 
            placeholder="Type a message..." />

            <button type="submit" className="bg-blue-500 text-white p-3 rounded-r-lg
            hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 
            focus:ring-blue-300" >
            <Send size={24} />
            </button>

            {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-20 left-4 bg-white">
                    <EmojiPicker 
                    onEmojiClick={(emojiObject) => {
                        setMessage((prev) => prev + emojiObject.emoji)
                    }} />
                </div>
            )}
        </form>
}

export default MessageInput;