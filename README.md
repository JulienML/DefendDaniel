# DefendDaniel - README

## 🎮 Game Overview

**DefendDaniel** is a thrilling courtroom drama game created during the **MistralAI GameJam Hackathon**, based on the theme **"You don't control the main character."** In this game, you step into the shoes of Daniel's defense lawyer.

### 🕵️ The Story

Daniel is just an ordinary guy who hasn't done anything wrong—or so he claims. Yet, here he is, summoned to court. Daniel doesn't have much money, which is why he's chosen you, dear counselor, to defend him. But you're not an ordinary lawyer.

You possess a strange Neuralink implant that whispers words into your mind, and not everything seems right with you upstairs. Will you rise to the challenge and deliver justice for Daniel, or will your "special" condition jeopardize your case?

**Your mission:** Defend Daniel within a one-minute time frame, using key phrases imposed by your Neuralink implant. Construct your arguments wisely—those mandatory words might just ruin your defense if you're not careful!

### 📸 Game Screenshots

| **Menu Screen** | **Courtroom Scene** |
|:---:|:---:|
| ![Menu](/public/images/menu.png) | ![Court](/public/images/court.png) |
| ![Lawyer](/public/images/lawyer.png) | ![Verdict](/public/images/verdict.png) |
| **Lawyer's Office** | **Verdict Scene** |

---

## 🛠️ Upcoming Features

| Feature	       | Status          |
| :--------------- |:----------------|
| Enhanced Prompts	  |   🔵      |
| Background Music  | 🔵            |
| Dynamic Case Scenarios  | 🔵         |
| Leaderboard System  | 🔵        |
| Responsive Mode  | 🔵        |
| Introduction Text Layout  | 🔵        |

> Legend:
> - 🟡 In Progress: Currently being developed
> - 🔵 Planned: On the roadmap
> - 🟢 Completed: Ready to use

---

## 🚀 Installation Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/DefendDaniel.git
   cd DefendDaniel
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Open `.env` file and fill in the required API keys and configuration values

3. **Install Dependencies** Using **pnpm** (preferred):
   ```bash
    pnpm install
   ```

    Alternatively, you can use **npm**:
   ```bash
    npm install
   ```

4. **Run the Development Server**
   ```bash
   pnpm run dev
   ```

   Navigate to http://localhost:3000 in your browser to start playing.


4. **Build for Production**
   ```bash
   pnpm build
   ```

   Then run 

   ```
   pnpm start
   ```

4. **Docker (Optional)**
    ```bash
    docker build -t defenddaniel .
    docker run -p 7860:7860 defenddaniel
    ```

---

## 🤝 Contributing

We welcome and appreciate contributions from the community! Here's how you can contribute:

### Types of Contributions

- 🐛 **Bug Reports**: Create an issue describing the bug and how to reproduce it
- ✨ **Feature Requests**: Suggest new features or improvements
- 📝 **Documentation**: Help improve or translate the documentation
- 💻 **Code Contributions**: Submit pull requests with bug fixes or new features

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/DefendDaniel.git
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed

4. **Test Your Changes**
   - Ensure all existing tests pass
   - Add new tests if needed
   - Test the application locally

5. **Submit a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Update the README if needed

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing project structure
- Use meaningful commit messages
- Keep pull requests focused on a single feature or fix
- Add appropriate documentation for new features

### Need Help?

Feel free to create an issue for:
- Questions about the codebase
- Clarification on how to implement a feature
- Discussion about potential improvements

We aim to review all contributions within a week. Thank you for helping improve DefendDaniel! 🙏

---

⚖️ Good luck defending Daniel! The courtroom is yours.