import { useMatchStore } from "../store/useMatchStore"


const getNotificationStyle = (swipeNotification) => {
    if (swipeNotification === "liked") {
        return "text-green-500 animate-bounce"
    }
    if (swipeNotification === "passed") {
        return "text-red-500 animate-bounce"
    }
    if (swipeNotification === "matched") {
        return "text-blue-500 animate-bounce"
    }
    return "";
}

const getNotificationText = (swipeNotification) => {
    if (swipeNotification === "liked") {
        return "Đã thích!"
    }
    if (swipeNotification === "passed") {
        return "Đã bỏ qua!"
    }
    if (swipeNotification === "matched") {
        return "Đã ghép đôi thành công!"
    }
    return "";
}


const SwipeNotification = () => {
    const { swipeNotification } = useMatchStore();
    return (
        <div className= {`absolute top-10 left-0 right-0 text-center text-2xl font-bold ${getNotificationStyle(swipeNotification)}
        `}>
            {
                getNotificationText(swipeNotification)
            }
        </div>
    )
}

export default SwipeNotification;