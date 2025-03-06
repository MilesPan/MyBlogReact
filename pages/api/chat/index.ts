import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const { message } = req.body;
  if (!message) {
    res.status(400).end();
    return;
  }

  // 监听连接关闭
  const closeConnection = () => {
    if (!res.writableEnded) {
      res.end();
    }
  };

  // 当客户端断开连接时清理
  req.on("close", closeConnection);

  const data = {
    stream: true,
    model: "doubao-1-5-vision-pro-32k-250115",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: message,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(process.env.CHAT_API_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VOLCES_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const reader = response.body?.getReader();
    if (!reader) {
      return res.end();
    }

    while (true) {
      const { done, value } = await reader.read();
      
      // 检查连接是否已关闭
      if (!res.writableEnded) {
        if (done) {
          res.write('data: [DONE]\n\n');
          res.end();
          break;
        }
        res.write(value);
      } else {
        break;
      }
    }
  } catch (error) {
    closeConnection();
  }
}
