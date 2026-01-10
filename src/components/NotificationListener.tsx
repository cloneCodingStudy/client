"use client";

import { useEffect } from "react";
import { chatService } from "@/services/chatService";
import toast from "react-hot-toast";
import useUserStore from "@/store/useUserStore";

export default function NotificationListener() {
  const { user } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!user || !token) return;

    chatService.connect(token);

    const unsubscribe = chatService.addNotificationHandler((data) => {
      if (data.sender === user.email) return;

      toast.success(`✉️ ${data.senderName || '새 메시지'}: ${data.content}`, {
        position: "top-right",
      });
    });

    return () => unsubscribe();
  }, [user]);

  return null;
}