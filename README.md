NORA.AI is a React-based web application designed to assist surgical trainees in analyzing and improving their techniques. It provides an interactive interface to review surgical procedure videos, identify errors, and generate detailed feedback reports in PDF format. The application integrates AI-powered feedback and annotations to enhance the learning experience.

## Features

- **Frame-by-Frame Navigation**: Navigate through surgical procedure frames with keyboard controls.
- **Error Annotations**: View detailed annotations for errors detected in specific frames.
- **AI-Powered Chatbot**: Ask NORA.AI for insights and suggestions on surgical techniques.
- **PDF Report Generation**: Generate comprehensive feedback reports in PDF format.
- **Customizable Branding**: Tailor the report's branding to your organization.

## How to Use

1. **Load Data**: The application uses a preloaded JSON file (`dummy-file.json`) containing metadata and error annotations for a surgical procedure.
2. **Navigate Frames**: Use the arrow keys to move through the frames and view annotations for errors.
3. **Ask NORA AI**: Use the chatbot to ask questions about the current frame or error.
4. **Generate Reports**: Click the "Export PDF" button to generate a detailed feedback report.

## Tech Stack

This project is built using modern web technologies:

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static typing.
- **Vite**: A fast build tool for modern web applications.
- **@react-pdf/renderer**: A library for generating PDF documents in React.
- **Zod**: A TypeScript-first schema validation library.
- **React Markdown**: For rendering Markdown content in the chatbot.
- **Date-fns**: A library for manipulating and formatting dates.

### Backend

- **Express**: A Node.js framework for building REST APIs.
- **CORS**: Middleware for handling cross-origin requests.
- **Node.js**: A JavaScript runtime for server-side development.

### AI Integration

- **OpenAI API**: Used to power the NORA AI chatbot for providing feedback and insights.

### Development Tools

- **ESLint**: A tool for identifying and fixing code quality issues.
- **TypeScript ESLint**: Type-aware linting for TypeScript.
- **Vite Plugin React**: For fast refresh and optimized builds.

## Project Structure

The project is organized as follows:

- **`src/`**: Contains all source code, including components, assets, and utilities.
- **`public/`**: Static assets like images and logos.
- **`server.js`**: A lightweight Express server for handling comments and feedback.
- **`package.json`**: Defines dependencies and scripts for development.

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SurgicalFeedbackViewer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Start the backend server:
   ```bash
   npm run start:server
   ```
5. Open the application in your browser at `http://localhost:5173`.

## License

This project is licensed under the MIT License.
