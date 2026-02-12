#  TaskPal: Your Ultimate  Productivity Hub

Welcome to **TaskPal**, a modern, full-stack task management application designed for teams that value both organization and aesthetics. Whether you're managing a solo project or coordinating across multiple organizations, TaskPal has you covered.

##  Key Features

### 🏢 Multi-Organization Support
Switch seamlessly between different projects or organizations without logging out. Invite team members with unique codes and manage tasks specific to each workspace.

###  5 Curated Theme Palettes
Productivity doesn't have to be boring. Choose from five beautiful, hand-crafted themes to match your mood:
*   **☀️ Light**: Clean, crisp, and high-contrast.
*   **🌙 Dark**: Sleek, modern, and easy on the eyes.
*   **🌊 Ocean**: Calming deep blues for focused work.
*   **🌲 Forest**: Earthy greens for a fresh perspective.
*   **🌅 Sunset**: Warm purples and pinks for creative vibes.

###  Intelligent Dashboard
Get a high-level view of your productivity. Interactive D3-powered charts give you a real-time breakdown of pending, completed, and overdue tasks across your active organization.

###  Rapid Task Management
Assign tasks, set priorities (Low, Medium, High), and track deadlines effortlessly. Receive email notifications when tasks are assigned to you.

##  Tech Stack

*   **Frontend**: React (Vite), D3.js, Vanilla CSS for custom premium aesthetics.
*   **Backend**: Node.js, Express.
*   **Database**: MongoDB (Mongoose).
*   **Auth**: JWT (JSON Web Tokens).
*   **Testing**: Jest & Supertest (15+ integrated backend tests).
*   **CI/CD**: Fully configured GitHub Actions pipeline for automated testing and linting.

##  Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Atlas (or a local MongoDB instance)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [your-repo-link]
    cd task-management
    ```

2.  **Setup Backend**:
    ```bash
    cd backend
    npm install
    cp .env.example .env # Add your MongoDB URI and JWT_SECRET
    npm start
    ```

3.  **Setup Frontend**:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

## 🤝 Contributions
TaskPal is an open-source project and contributions are welcome! If you're interested in helping out:
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---
Built with ❤️ for productivity lovers everywhere.
