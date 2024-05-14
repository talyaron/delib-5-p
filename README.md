Sure, here's the content in Markdown format:

```markdown
# Delib-5

## Introduction

Delib-5 is an inclusive B2C deliberative app that provides a diverse range of deliberation methods. Deliberation is an informed and inclusive mode of discussion aimed at discovering the most optimal solution for all stakeholders while actively striving to minimize any harm to the interests of those who might be adversely affected by the proposed solution.

For more information and a roadmap, please refer to the [wiki](https://github.com/delib-org/delib-5/wiki) in this repository.

## Prerequisites

Before getting started with Delib-5 development, it's recommended to have a basic understanding of the following technologies:

- Firebase
- React
- Redux
- Progressive Web Apps (PWA)

## Installation

Delib-5 uses a technological stack consisting of React-Redux-PWA (built with Vite) and Firebase. To install and set up the project on your local machine, follow these steps:

1. **Clone the repository**

   ```bash
   git clone https://github.com/delib-org/delib-5.git
   cd delib-5
   ```

2. **Install dependencies**

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install functions dependencies
   cd ../functions
   npm install
   ```

3. **Install Firebase emulators**

   Make sure you have Java JDK (version 17 or higher) installed on your machine. If not, please install it from [Oracle's website](https://www.oracle.com/il-en/java/technologies/downloads/#java21).

   Then, install the Firebase emulators:

   ```bash
   # Install Firebase CLI (if not already installed)
   npm install -g firebase-tools

   # Log in to your Google account
   firebase login

   # Initialize emulators
   firebase init emulators
   ```

4. **Set up Firebase configuration**

   - In the Firebase console, create a new project named "delib-5" and copy the project ID.
   - In the `.firebaserc` file, replace the project ID with the one you just created.
   - Run `firebase use <project-id>` to select the new project.

5. **Create `configKey.ts` file**

   Under `src/functions/db/`, create a new file named `configKey.ts` and add the following code, replacing the placeholders with your actual Firebase project configuration:

   ```typescript
   export const keys = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     databaseURL: "your-database-url",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id",
     measurementId: "your-measurement-id"
   }

   export const vapidKey = 'your-vapid-key';
   ```

   Note: This file is not uploaded to GitHub, and you'll need to create it yourself.

## Development mode

To start the development server, run the following commands:

```bash
# Start the emulators
npm run deve

# Start the client
npm run dev

# Start the Firebase functions (server)
cd functions
npm run dev
```

You can access the app at `http://localhost:5173` and the emulators at `http://localhost:5002`.

## Coding Style

### Naming Conventions

- **File names**: Use camelCase for file names (e.g., `myFile.ts`).
- **Component names**: Use PascalCase for component names (e.g., `MyComponent.tsx`).
- **Variable names**: Use camelCase for variable names (e.g., `myVariable`).
- **Function names**: Use camelCase for function names (e.g., `myFunction`).

### SCSS

- **CSS naming**: In a component, use the component name as a prefix for all CSS classes (e.g., `myComponent-myElement`).
- **Component styling**: Specific component styling must be in the component folder (e.g., `myComponent/myComponent.scss`).
- **Global styling**: Global styling must be in the `view/style` folder (e.g., `src/view/style/buttons.scss`).

### React

- **Component structure**: Each component should have its own folder with a `ComponentName.tsx` file and a `ComponentName.scss` file.
- **MVC architecture**: Each component should have its own folder with a `ComponentName.tsx` file, a `ComponentName.scss` file, and a `ComponentNameCont.ts` file. All folders are divided by the MVC structure.
- **Higher-Order Components**: Use Higher-Order Components (HOCs) for reusable components as much as possible.

By following these guidelines, you can ensure a consistent and maintainable codebase for Delib-5.
```