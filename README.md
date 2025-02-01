# CodeGuardian: Web Application Vulnerability Scanner

**CodeGuardian** is a simple web app security scanner built with React and Node.js. It helps you scan websites for common vulnerabilities and provides detailed reports on potential security risks.

> **Note:** This is the first version of CodeGuardian. More features and improvements will be added over time to make it even more robust.


## Key Features

- **Vulnerability Scanning:** Checks web applications for common security issues.
- **OWASP Top 10:** Detects vulnerabilities from the OWASP Top 10 list.
- **Detailed Reports:** Provides clear results and reports after each scan.
- **Modern UI:** Built with React for an intuitive and responsive interface.

---

## Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Other:** Axios, JWT for authentication, and custom CSS for styling

---

## Project Structure

```
CodeGuardian/
├── client/                           # React frontend
│   ├── public/                       # Static public files (e.g., index.html)
│   └── src/                          # Source files
│       ├── assets/                   # Images, fonts, etc.
│       │   └── images/
│       │       └── Ninja.png
│       ├── components/               # Reusable UI components
│       │   ├── LoginForm.jsx
│       │   ├── Navbar.jsx
│       │   ├── ScanForm.jsx
│       │   ├── ScanResults.jsx
│       │   ├── SignupForm.jsx
│       │   └── LandingPage.jsx
│       ├── pages/                    # Page-level components
│       │   ├── AboutPage.jsx
│       │   ├── HomePage.jsx
│       │   ├── ScanPage.jsx
│       │   └── LandingPagePage.jsx
│       ├── services/                 # API calls (optional)
│       │   └── api.js
│       ├── config/                   # Theme and config files (optional)
│       │   └── theme.js
│       └── index.js                  # React app entry point
│
└── server/                           # Node.js backend
    ├── config/                       # Configuration files
    │   ├── db.js
    │   └── dotenv.config.js
    ├── controllers/                  # Business logic
    │   ├── authController.js
    │   ├── scanController.js
    │   └── reportController.js
    ├── middleware/                   # Express middleware
    │   ├── asyncHandler.js
    │   ├── authMiddleware.js
    │   └── errorHandler.js
    ├── models/                       # Database models
    │   ├── ScanResult.js
    │   └── User.js
    ├── routes/                       # API routes
    │   ├── authRoutes.js
    │   ├── reportRoutes.js
    │   └── scanRoutes.js
    ├── utils/                        # Utility functions
    └── server.js                     # Main server entry point
```

---

## Prerequisites

- **Node.js** (v16+)
- **MongoDB**
- **npm** or **yarn**

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codeguardian.git
cd codeguardian
```

### 2. Set Up the Backend

```bash
cd server
npm install

# Create a .env file and add your configurations:
touch .env
```

Add the following to your `.env` file:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 3. Set Up the Frontend

```bash
cd ../client
npm install
```

### 4. Run the Application

**Start the Backend (in one terminal):**

```bash
cd server
npm start
```

**Start the Frontend (in another terminal):**

```bash
cd client
npm start
```

Now, open your browser and go to `http://localhost:3000` to use the application.

---

## How to Use

1. Open the application in your browser.
2. Enter the URL or details of the web application you want to scan.
3. Click on the **"Start Vulnerability Scan"** button.
4. View the detailed vulnerability report once the scan is complete.

---

## Planned Enhancements

- **Improved Scanning Algorithms:** Faster and more accurate scans.
- **Real-Time Monitoring:** Get updates as scans are running.
- **Enhanced Reporting:** More detailed and exportable reports.
- **Multi-Language Support:** For global users.

---

## Security Notice

This tool is designed for educational purposes and authorized security testing. Always obtain proper permission before scanning any website.

---

## Contributing

1. Fork this repository.
2. Create a new branch for your feature or fix.
3. Commit your changes.
4. Push the branch and open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For issues or collaboration, please reach out at: [kamalkalyan1260@gmail.com](mailto:kamalkalyan1260@gmail.com)

---

Happy coding, and stay secure!