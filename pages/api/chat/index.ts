import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { messages } = req.body;
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.VOLCES_API_KEY}`,
        },
        body: JSON.stringify({
            messages: messages,
            model: 'doubao-1-5-vision-pro-32k-250115',
            stream: true
        }),
    });
    const data = await response.json();
    res.status(200).json(data);
}