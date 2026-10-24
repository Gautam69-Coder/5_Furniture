import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "../api";

/* ── Product card (Off-white & Black luxury style) ── */
const ProductChatCard = ({ product }) => (
  <Link
    to={`/collections/${product.category}/products/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
    className="flex gap-3 rounded-xl p-2.5 mt-1.5 transition-all bg-white border border-[#e5e5e5] hover:border-black hover:shadow-sm"
  >
    <img
      src={product.images?.[0]}
      alt={product.name}
      className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-[#f5f5f3]"
      onError={e => { e.target.style.display = "none"; }}
    />
    <div className="flex flex-col justify-center min-w-0 flex-1">
      <p className="text-xs font-medium text-black truncate">{product.name}</p>
      <p className="text-xs font-semibold text-neutral-800">₹{product.price?.toLocaleString("en-IN")}</p>
      <span className="text-[10px] mt-0.5 text-neutral-500 font-medium inline-flex items-center gap-0.5 group-hover:text-black">
        View Product <ChevronRight className="w-3 h-3" />
      </span>
    </div>
  </Link>
);

/* ── Typing dots ── */
const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-[#e7e5e0] rounded-2xl rounded-bl-sm shadow-sm w-fit">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-neutral-800"
        animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const WELCOME = {
  role: "assistant",
  text: "Hi! I'm your Freedom Tree design assistant 🛋️\nTell me about your room and budget — I'll find the perfect furniture for you!",
  products: [],
};

/* ── Resize hook: drag top-left corner ── */
function useResize(minW, minH, maxW, maxH, defaultW, defaultH) {
  const [size, setSize] = useState({ w: defaultW, h: defaultH });
  const dragging = useRef(false);
  const startData = useRef({});

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    startData.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };

    const onMove = (ev) => {
      if (!dragging.current) return;
      const dx = startData.current.x - ev.clientX; // drag left → wider
      const dy = startData.current.y - ev.clientY; // drag up → taller
      setSize({
        w: Math.min(maxW, Math.max(minW, startData.current.w + dx)),
        h: Math.min(maxH, Math.max(minH, startData.current.h + dy)),
      });
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [size, minW, minH, maxW, maxH]);

  return [size, onMouseDown];
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const [size, onResizeMouseDown] = useResize(300, 380, 600, 750, 360, 520);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 96) + "px";
  }, [input]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: "user", text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const history = nextMessages
      .slice(1, -1)
      .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/ai/chat`, { message: text, history });
      const { reply, products } = res.data.data;
      setMessages(prev => [...prev, { role: "assistant", text: reply, products: products || [] }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again.", products: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating launcher button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black text-[#fcfbf9] flex items-center justify-center shadow-xl border border-neutral-700 hover:bg-neutral-900 transition-colors"
        aria-label="Open AI design assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "chat"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center"
          >
            {open ? <X className="w-5 h-5 stroke-[2.2]" /> : <MessageCircle className="w-6 h-6 stroke-[2]" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden border border-[#dcd8d0] shadow-2xl"
            style={{
              width: size.w,
              height: size.h,
              backgroundColor: "#f7f6f2", // Elegant off-white
            }}
          >
            {/* Top-left resize handle */}
            <div
              onMouseDown={onResizeMouseDown}
              className="absolute top-0 left-0 w-4 h-4 z-20 cursor-nw-resize flex items-center justify-center group"
              title="Drag to resize"
            >
              <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-neutral-400 group-hover:border-black transition-colors rounded-tl-sm ml-1 mt-1" />
            </div>

            {/* Header (Black & Off-white) */}
            <div className="bg-black text-[#faf9f5] px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#faf9f5]">
                  <Sparkles className="w-4 h-4 text-[#faf9f5]" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-[#faf9f5]">Freedom Tree AI</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[11px] text-neutral-400 font-medium">Interior Design Assistant</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages area (Off-white canvas) */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3.5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#d4d0c8 transparent",
                backgroundColor: "#f7f6f2",
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[85%]">
                    <div
                      className={`px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-black text-[#faf9f5] rounded-2xl rounded-br-sm"
                          : "bg-white text-neutral-900 border border-[#e5e2da] rounded-2xl rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Products */}
                    {msg.role === "assistant" && msg.products?.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider px-1 text-neutral-600">
                          Recommended Products ({msg.products.length})
                        </p>
                        {msg.products.slice(0, 6).map(p => (
                          <ProductChatCard key={p._id} product={p} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <TypingDots />
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="flex-shrink-0 p-3 bg-[#f2f0ea] border-t border-[#e2dfd7]">
              <div className="flex items-end gap-2 bg-white rounded-xl px-3 py-2 border border-[#d9d5cb] focus-within:border-black transition-colors shadow-sm">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about furniture, style, budget…"
                  disabled={loading}
                  className="flex-1 resize-none text-sm bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:opacity-50"
                  style={{ maxHeight: "96px", lineHeight: "1.5" }}
                />
                <motion.button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-black text-[#faf9f5] flex items-center justify-center flex-shrink-0 disabled:opacity-25 hover:bg-neutral-800 transition-colors shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2.2]" />
                </motion.button>
              </div>
              <p className="text-[10px] text-center mt-1.5 text-neutral-500 font-medium">Powered by Groq AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
