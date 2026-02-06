# 🛡️ Khersonec Support Bot (TS Edition)

![image](https://github.com/JuanDelPueblo/discord-application-bot/assets/49998039/3e092d36-ff01-4c4b-8aa5-be1c5dca8722)

An advanced application management system for Discord, rewritten in **TypeScript**. This bot allows you to create forms, manage submissions, and automate member approvals directly within your server.

## ✨ Key Features (Current Build)

* **TS Architecture:** Fully rewritten with strict typing and modular command handling.
* **Native Integration:** Uses Discord modals, action rows, and buttons for a smooth UI.
* **Smart Setup:** Use `/form setup` to initialize a specialized application channel.
* **Database Driven:** Powered by Sequelize and SQLite for reliable data persistence.
* **Localized Logs:** Built-in Ukrainian console logging and error handling for regional developers.

## 🚀 Installation

1. **Prerequisites:** Install Node.js (v18 or newer recommended).
2. **Clone:**
   ```bash
   git clone [https://github.com/your-username/khersonec-support.git](https://github.com/your-username/khersonec-support.git)
   cd khersonec-support
```
3. **Install Dependencies:**

```bash
npm install
Configuration: Rename config.example.json to config.json and fill in your Bot Token and Client ID.
```

4. Run:

```Bash
# For development (TypeScript execution)
npm run dev
```

### 🛠️ Commands
/form setup — Create a new application prompt in the current channel.
/form edit — Modify the existing form's title and description.
/form list — View all active form channels on the server.
/form submit [True/False] — Enable or disable the ability for users to apply.

### ⚖️ License
Distributed under the MIT License. Feel free to use, modify, and share!

Maintained with pride from Kherson, Ukraine