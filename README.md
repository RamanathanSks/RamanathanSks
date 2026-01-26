# Ramanathan Sks - Portfolio

This is the source code for my personal portfolio, showcasing my skills, projects, and experiences. The project is built using **Angular 21**, integrated with **Firebase** for hosting and backend services, and **Node.js** for server-side functionality.

## 🚀 Deployed Application

You can view the live version of my portfolio here: [RamanathanSks 👀](https://ramanathan-sks.web.app)

---

## 👨‍💻 Tech Stack

- **Frontend**: Angular 21
- **Backend**: Node.js
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Styling**: Vanilla CSS with modern Glassmorphism
- **AI Assisted**: Built & Refined with **Antigravity AI (Claude)**

---

## 📂 Project Structure

```
|-- src/
|   |-- app/
|   |   |-- components/      # Angular components
|   |   |-- services/        # Angular services
|   |-- assets/              # Static assets
|   |-- environments/        # Environment configurations (Protected URLs)
|-- functions/               # Node.js Cloud Functions
|-- firebase.json            # Firebase configuration
|-- angular.json             # Angular CLI configuration
|-- package.json             # Project dependencies
```

---

## 🔧 Setup and Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/RamanathanSks/RamanathanSks-v2.git
   cd RamanathanSks-v2
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add your Firebase configuration to `src/environments/environment.ts`:
     ```typescript
     export const environment = {
       production: false,
       firebase: {
         apiKey: 'your-api-key',
         authDomain: 'your-auth-domain',
         projectId: 'your-project-id',
         storageBucket: 'your-storage-bucket',
         messagingSenderId: 'your-messaging-sender-id',
         appId: 'your-app-id',
       },
     };
     ```

4. **Run Locally**

   ```bash
   ng serve
   ```

   The app will run at `http://localhost:4200`.

5. **Deploy to Firebase**
   - Build the project:
     ```bash
     ng build
     ```
   - Deploy to Firebase:
     ```bash
     firebase deploy
     ```

---

## ✨ Recent Enhancements (Built with AI)

- **Modern Glassmorphism Design**: Complete overhaul of the 404 and Offline components with sleek, semi-transparent layouts and blur effects.
- **Dynamic Animations**: Added floating effects to error codes and pulsing status indicators for a premium feel.
- **Centralized Security**: Moved all hardcoded Firebase tokens, social links, and resource URLs to environment files for better management.
- **UX Protection**: Implemented global image protection policies to prevent dragging and unauthorized interactions.
- **Improved Performance**: Optimized image loading states and masonry grid layouts in the Gallery.

---

## 🌟 Features

- Interactive UI built with Angular 21.
- Hosted on Firebase for fast and reliable delivery.
- Firebase Firestore for real-time database needs.
- Fully responsive design for mobile and desktop.

---

## 🛡 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙋🏻‍♂️ Author

**Ramanathan Sks**  
Feel free to reach out via [LinkedIn](https://www.linkedin.com/in/ramanathan-sks) or email at `ramanathan.sks@gmail.com`.
Built with 🧠 and 🤖.
