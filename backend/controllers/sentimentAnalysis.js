import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
console.log(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyseSentiment = async (req, res) => {
    try {
        const {tweet}  = req.query;
        console.log(tweet);
        const prompt = `"${tweet}" -> what is the sentiment of this text. reply under one word positive negative neutral and also with emoji.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        return res.status(201).json({
            text: text,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An error occurred while processing your request.',
            success: false,
        });
    }
};
export const ChatBot = async (req,res) =>{
    try{
        const {query,context} = req.query;
        const ContextQuery = context?.reduce((acc,element)=>{
            return acc + element.user + ":" + element.text + " "; 
        },"bot :Hello! I am Kuksie. How can I help you today? 😁🐣");
        const finalQuery = "This is the chat history: " + ContextQuery + " Current query: " + query + ". ###Generate a response based on the context of the chat and the current query.and just generate direct clear response dont mention again and again that you are generating it based on context of chat###"

        console.log(finalQuery);
        const result = await model.generateContent(finalQuery);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        return res.status(201).json({
            text: text,
            user:"bot",
            success: true,
    })}catch(error){
        console.log(error);
    }
}

//NOTES
//accumulator holds the temp returned value.
