# 🧠 Smart Summarizer – Chrome Extension

**Smart Summarizer** is a lightweight, AI-powered Chrome Extension that lets you summarize any blog post, news article, or long-form content directly from your browser. It uses Google's **Gemini Pro** (via Generative Language API) to deliver high-quality summaries in **Short (100 words)**, **Medium (200 words)**, or **Long (500 words)** formats.

> 🚀 Perfect for students, professionals, researchers, or anyone who wants to save time and read smarter.

---

## 🎯 Why Smart Summarizer?

Reading lengthy content can be time-consuming, especially when you're just looking for the gist. Smart Summarizer helps you:

- Understand web content in seconds
- Customize the length of summaries
- Copy results effortlessly
- Monitor your monthly usage (freemium model)


## ✨ Features

✅ Summarize **any webpage or article**  
✅ Choose from **3 summary lengths**:  
  - `Short (100 words)`  
  - `Medium (200 words)`  
  - `Long (500 words)`  
✅ Right-click on the summary to **copy to clipboard**  
✅ Clean **dark-mode user interface**  
✅ Built-in **quota tracking** – first 5 summaries/month are free  
✅ Lightweight (~100 KB), secure and private  
✅ Uses **Gemini Pro Flash API** (Google AI)

---

## 🔧 Tech Stack

- **Chrome Extension**: Manifest v3
- **JavaScript (Vanilla)** + DOM manipulation
- **Gemini Pro Flash API** for summarization
- **CSS** with dark theme styling
- **Chrome Storage API** to track monthly usage quota

---

## 🧪 Local Installation (Development Mode)

To test the extension on your local Chrome browser:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-summarizer.git
   cd smart-summarizer

2. **Open Chrome and navigate to:**
    ```bash
    chrome://extensions/

3. **Enable Developer Mode**

4. **Click "Load Unpacked" and select the project root folder**

5. **Pin the extension to your toolbar**

6. **Visit any website or article → Click the extension icon → Choose length → Get your summary!**

## 🔐 API Key Management

This extension currently uses Gemini Pro via a hardcoded API key. Avoid pushing your actual key to GitHub!

✅ Recommended:

- Replace your API key before using

- Consider moving summarization to a backend (Node.js, Firebase, etc.)

- Use environment variables or secure secrets management

## 💸 Monetization (Freemium Model)

- 🆓 5 summaries/month for free users

- ⏳ Usage is tracked via chrome.storage.local

- 📦 Future roadmap includes support for:

    - 30, 100, or lifetime summaries

    - Stripe / Razorpay integration

    - Firebase Auth for premium users

## 🛣 Roadmap

- Basic summarization via Gemini API

- Summary length selector

- Right-click to copy

- Monthly quota system (5 free uses)

- Firebase Auth for login & user tracking

- Stripe/Razorpay for one-time & subscription plans

- Deployment to Chrome Web Store

- Web dashboard for analytics

## 🚀 What’s Next?

I'm preparing for the official launch on the Chrome Web Store soon!
Stay tuned — exciting updates are on the way. 🙌

## 🔗 Connect

- [LinkedIn](https://www.linkedin.com/in/dcoder-nikhil/)

- Open for feedbacks or contribution on:  [Mail](nikhil.ranjanai@gmail.com)


Made with ❤️ by **Dcoder-Nikhil**