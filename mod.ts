import { Bot } from "https://deno.land/x/grammy@v1.12.1/mod.ts";

// Initialize the bot with the token from BotFather
const bot = new Bot("<YOUR TELEGRAM BOT TOKEN>");

// Telegra.ph upload URL
const TELEGRAPH_API_URL = "https://telegra.ph/upload";

// Function to upload files to Telegra.ph
async function uploadToTelegraph(file: Uint8Array, mimeType: string) {
    const formData = new FormData();
    formData.append("file", new Blob([file], { type: mimeType }), "file");

    const response = await fetch(TELEGRAPH_API_URL, {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (result.error) {
        throw new Error(result.error);
    }

    return result[0].src;
}

// Handle incoming photo messages
bot.on("photo", async (ctx) => {
    try {
        // Get the largest photo size
        const file = await ctx.getFile();
        const fileUrl = await file.download();
        const mimeType = "image/jpeg";  // Telegra.ph supports jpeg and png

        const fileBytes = new Uint8Array(await fileUrl.arrayBuffer());

        // Upload the photo to Telegra.ph
        const telegraphUrl = await uploadToTelegraph(fileBytes, mimeType);

        // Reply with the Telegra.ph URL
        await ctx.reply(`Uploaded to Telegra.ph: https://telegra.ph${telegraphUrl}`);
    } catch (error) {
        console.error(error);
        await ctx.reply("Failed to upload the photo.");
    }
});

// Handle incoming video messages
bot.on("video", async (ctx) => {
    try {
        // Get video file
        const file = await ctx.getFile();
        const fileUrl = await file.download();
        const mimeType = "video/mp4";  // Telegra.ph only supports image uploads, videos can be handled by other services

        const fileBytes = new Uint8Array(await fileUrl.arrayBuffer());

        // Upload the video to Telegra.ph (NOTE: Telegra.ph may not support video, so you may use a different service for video uploads)
        const telegraphUrl = await uploadToTelegraph(fileBytes, mimeType);

        // Reply with the Telegra.ph URL
        await ctx.reply(`Uploaded to Telegra.ph: https://telegra.ph${telegraphUrl}`);
    } catch (error) {
        console.error(error);
        await ctx.reply("Failed to upload the video.");
    }
});

// Start the bot
bot.start();
