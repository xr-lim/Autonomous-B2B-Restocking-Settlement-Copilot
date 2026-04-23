"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Bell, Settings, HelpCircle, User, Paperclip, Send, Smile, Phone, Video, MoreVertical, FileText, Menu } from "lucide-react"
import { io, Socket } from "socket.io-client"

type Message = {
  sender: string
  content?: string
  file_url?: string
  file_name?: string
  file_type?: string
}

export function MerchantDashboardChat() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [roomId, setRoomId] = useState("100") // Default demo room
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [joined, setJoined] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!joined) return
    const newSocket = io("http://localhost:8000", { transports: ["websocket"] })

    newSocket.on("connect", () => {
      newSocket.emit("join_room_event", { room_id: roomId, role: "merchant" })
    })

    newSocket.on("receive_message", (data: Message) => {
      if (data.sender !== "System") {
         setMessages((prev) => [...prev, data])
      }
    })

    setSocket(newSocket)
    return () => { newSocket.disconnect() }
  }, [joined, roomId])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!socket || !inputValue.trim()) return

    socket.emit("send_message", {
      room_id: roomId,
      sender: "Merchant", // Display as Merchant on supplier side
      content: inputValue.trim(),
    })
    setMessages((prev) => [...prev, { sender: "Merchant", content: inputValue.trim() }])
    setInputValue("")
  }

  if (!joined) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#212121]">
        <button onClick={() => setJoined(true)} className="rounded-full bg-[#8774e1] px-10 py-4 text-white hover:bg-[#7261cc]">
          Open Telegram Web (Merchant View)
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0f0f0f] text-white font-sans">
      {/* Sidebar - Telegram aesthetic */}
      <div className="hidden w-[350px] flex-col border-r border-[#212121] bg-[#1c1c1d] sm:flex">
        <div className="flex items-center gap-4 px-4 h-14">
          <button className="text-gray-400 hover:text-white"><Menu className="size-6" /></button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full rounded-full bg-[#2c2c2e] py-1.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none"
              readOnly
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Active Chat Item */}
          <div className="flex cursor-pointer items-center gap-3 bg-[#8774e1] px-4 py-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#10b981] text-lg font-bold">
              S
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between">
                <span className="font-medium text-white truncate">Supplier</span>
                <span className="text-xs text-[#e5e5ea]">12:00</span>
              </div>
              <p className="truncate text-sm text-[#e5e5ea]">Negotiation terms received</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col relative bg-[#181818] bg-[url('https://web.telegram.org/a/chat-bg-pattern-dark.png')] bg-repeat bg-[length:400px]">
        {/* Overlay to dim background */}
        <div className="absolute inset-0 bg-[#0f0f0f]/80 pointer-events-none z-0"></div>

        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#2c2c2e] bg-[#1c1c1d] px-4 z-20 w-full">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#10b981] text-sm font-bold">S</div>
            <div>
              <h2 className="font-medium tracking-wide">Supplier</h2>
              <p className="text-xs text-[#8774e1]">online</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <Search className="size-5 hover:text-white cursor-pointer ml-4" />
            <MoreVertical className="size-5 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-[15%] py-6 space-y-4 z-10">
          <div className="flex justify-center mb-6">
             <span className="bg-[#212121]/80 px-3 py-1 rounded-full text-xs font-medium text-gray-400 border border-[#2c2c2e]">
              Today
            </span>
          </div>

          <div className="flex justify-end">
             <div className="bg-[#8774e1] text-white px-4 py-2.5 rounded-2xl rounded-br-none shadow-sm max-w-[70%]">
              Hello, this is the Merchant team reaching out regarding your latest bulk quote. We'd like to negotiate the unit price.
             </div>
          </div>

          {messages.map((msg, idx) => {
            const isMe = msg.sender === "Merchant" || msg.sender === "Merchant Team"
            return (
              <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`px-4 py-2.5 rounded-2xl shadow-sm max-w-[80%] break-words flex flex-col gap-1 ${
                    isMe 
                      ? "bg-[#8774e1] text-white rounded-br-none" 
                      : "bg-[#212121] text-white rounded-bl-none"
                  }`}
                 >
                   {!isMe && <span className="text-[11px] text-green-400">{msg.sender}</span>}
                  
                  {msg.file_url && (
                    <div className="mb-1 mt-1">
                      {msg.file_type?.startsWith("image/") ? (
                        <img src={msg.file_url} alt={msg.file_name || "image"} className="max-w-[200px] h-auto rounded-lg object-cover" />
                      ) : (
                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#2c2c2e] p-2 rounded-lg hover:bg-[#3c3c3e] transition-colors">
                          <FileText className="size-5 text-[#8774e1]" />
                          <span className="text-sm truncate max-w-[150px]" title={msg.file_name}>{msg.file_name}</span>
                        </a>
                      )}
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-[#1c1c1d] p-3 z-10 flex justify-center w-full shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
          <div className="w-[70%] max-w-4xl flex items-end gap-2">
            <div className="flex flex-1 items-end rounded-2xl bg-[#212121] pl-2 pr-1 py-1">
              <button className="p-2 text-gray-400 hover:text-white">
                <Smile className="size-6" />
              </button>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e as any);
                  }
                }}
                placeholder="Write a manual message..."
                className="max-h-32 min-h-[44px] w-full resize-none bg-transparent px-2 py-2.5 text-[15px] outline-none text-white overflow-y-auto"
                rows={1}
              />
              <button className="p-2 text-gray-400 hover:text-white">
                <Paperclip className="size-6" />
              </button>
            </div>
            
            {inputValue.trim() ? (
              <button 
                onClick={handleSend}
                className="flex size-14 items-center justify-center rounded-full bg-[#8774e1] text-white shadow hover:bg-[#7261cc]"
              >
                <Send className="size-6 ml-1" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
