Sure, here's the content in Markdown format:


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

   # run emulators
   npm run deve
   ```

4. **Set up Firebase configuration**

   - In the Firebase console, create a new project named "delib-5" and copy the project ID.
   - Set up the `.firebaserc` file according to template in "firebase-config-files.txt", replace the project ID with the one you just created.
   - Run `firebase use <project-id>` to select the new project.

   - Set up your `firebase.json` file by copying the template from "firebase-config-files.txt". You do not have to adjust any attributes.

5. **Create `.env` files**

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

## Good Code Practices
In this project we follow some good code practices, that are important in software development. Here are some of them:

### DRY 
DRY stands for Don't Repeat Yourself. It is a principle of software development aimed at reducing the repetition of software patterns, replacing it with abstractions (generalized functions and variables) or using data normalization to avoid redundancy.

You can easily notice DRY, when you create some code, that you have to repeat in multiple places. For example, if you have a function that calculates the area of a rectangle, you can use it in multiple places, instead of writing the same code over and over again.

### SRP
SRP stands for Single Responsibility Principle. It is a principle of software development aimed at reducing the complexity of software by breaking it down into smaller, more manageable components. Each component should have a single responsibility, meaning that it should only be responsible for one thing, and not two or more things.
It follows from the DRY principle, because if you have a function that does multiple things, you will have to repeat it in multiple places, which violates the DRY principle.

### KISS
KISS stands for Keep It Simple, Stupid. It is a design principle that states that most systems work best if they are kept simple rather than made complicated. This means that you should strive for simplicity in your code, and avoid unnecessary complexity or over-engineering.

Both DRY and SRP are important principles in software development, as they help to reduce complexity, improve maintainability, and make code more readable and reusable.

### Readability
This means, that the code should be readable and understandable by anyone who reads it, not just the person who wrote it. Therefore naming variables and functions should be clear and descriptive, and the code should be well-organized and easy to follow, with elegant spacing and indentation.

### Design Patterns
Design patterns are reusable solutions to common problems in software design. They are like templates that you can use to solve a particular problem in a specific context. Design patterns help to improve the quality of software by providing proven solutions to recurring problems, and they can also make code more readable, maintainable, and scalable.
In this course we mostly use the MVC pattern, which stands for Model-View-Controller. It is a design pattern that separates the application into three main components: the model, the view, and the controller. The model represents the data and business logic of the application, the view represents the user interface, and the controller acts as an intermediary between the model and the view, handling user input and updating the model and view accordingly.

### Predesign your code
Before you start writing code, you should always plan and design your code first. This means that you should think about the structure of your code, the classes and functions you will need, and how they will interact with each other. You should also consider the requirements of the project, the goals you want to achieve, and the potential challenges you may face. By predesigning your code, you can avoid common pitfalls, such as spaghetti code, and ensure that your code is well-organized, readable, and maintainable.

### Testing
Testing is an important part of software development, as it helps to ensure that the code works as expected and that it is free of bugs and errors. There are different types of testing, such as unit testing, integration testing, and end-to-end testing, each of which serves a different purpose and helps to ensure the quality of the code. before you push a code to the main branch, you should always test it, to make sure that it works as expected.

### Deliverability
Deliverability is the ability to deliver a product or service to the customer in a timely and efficient manner. It is important to ensure that the code is delivered on time and meets the requirements of the customer. This means that you should set realistic deadlines, plan your work effectively, and communicate with the customer to ensure that the code meets their expectations.

### Refactoring
Refactoring is the process of restructuring existing code without changing its external behavior. It is an important part of software development, as it helps to improve the quality of the code, make it more readable and maintainable, and reduce technical debt. Refactoring involves making small, incremental changes to the code, such as renaming variables, extracting functions, and removing duplication, to improve its design and structure.

### Debugging & Refactoring
You can use your preferred methods of debugging, and when you find the bug, ensure it is fixed. Sometimes, after debugging, you may understand that refactoring the code is necessary to make it more predictable and maintainable. If that's the case, please refactor the code accordingly.

### YAGNI
YAGNI stands for You Aren't Gonna Need It. It is a principle of software development that states that you should not add functionality until it is needed. This means that you should avoid adding features or code that you think you might need in the future, but don't need right now.
