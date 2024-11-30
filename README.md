# **Real-Time Collaborative Document Editor - Backend**

This is the backend server for the **Real-Time Collaborative Document Editor**. It provides REST APIs for managing documents, user authentication, and real-time collaboration through WebSocket using **Socket.IO**.

---

## **Features**
1. **REST APIs**:
   - Create, fetch, update, and delete documents.
   - User authentication using tokens.
2. **Real-Time Collaboration**:
   - Supports multiple users editing the same document simultaneously.
   - Updates are synchronized in real-time using WebSocket.
3. **Scalability**:
   - Modular design with room for Redis integration for multi-instance deployments.
4. **Document Management**:
   - Supports document versioning.
   - Implements roles (editor/viewer) for access control.
5. **Error Handling**:
   - Handles invalid document IDs, user permissions, and network failures gracefully.

---

## **Tech Stack**
- **Node.js**: Server runtime.
- **Express.js**: Web framework for building REST APIs.
- **Socket.IO**: Real-time communication for collaborative editing.
- **MongoDB**: Database for persisting documents and user data.
- **Helmet**: For enhancing security.
- **CORS**: For handling cross-origin resource sharing.

---

## **Getting Started**

### **Prerequisites**
- Node.js (v14+ recommended)
- MongoDB (local or cloud instance)
- A frontend application (e.g., React) running on `http://localhost:5173`

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/avi9984/Real-Time-Doc-Editor.git
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a .env file in the root directory and configure the following environment variables:
   ```
   PORT=3000
   MONGO_URL=mongodb://localhost:27017/realtime-editor
   SECRET_KEY="your secrate key"
   ```
4. Start the backend server:
   ```
   npm start
   ```

