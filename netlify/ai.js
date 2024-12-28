// ai.js (Serverless function for AI and image generation)
const axios = require('axios');

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    if (!userMessage) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Message is required' }),
        };
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;  // Set your OpenAI API key as an environment variable

    // Check if the user message is a request for an image (simple example: if it includes "image")
    const isImageRequest = userMessage.toLowerCase().includes("image");

    try {
        if (isImageRequest) {
            // Generate image with DALL·E
            const response = await axios.post(
                'https://api.openai.com/v1/images/generations',
                {
                    prompt: userMessage,
                    n: 1,
                    size: "1024x1024", // You can change the size of the image
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const imageUrl = response.data.data[0].url;
            return {
                statusCode: 200,
                body: JSON.stringify({ imageUrl }),
            };
        } else {
            // Generate text response with GPT (for non-image requests)
            const textResponse = await axios.post(
                'https://api.openai.com/v1/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: userMessage }],
                    max_tokens: 150,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const aiMessage = textResponse.data.choices[0].message.content;
            return {
                statusCode: 200,
                body: JSON.stringify({ message: aiMessage }),
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process the request' }),
        };
    }
};
