### Step-by-Step Guide

#### Step 1: 🚀 Initial Setup

- Clone the repository: `git clone https://github.com/JakubMarczynski/decision-tree-backend1.git`
- Navigate: `cd decition-tree-backend1`
- Install dependencies: `npm ci`

#### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

#### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

To include the example payloads in your `README.md` on GitHub, you can structure them in a clear and concise manner to ensure they are easy to read and understand. Below is a suggested format:

---

## Example Payloads for `/execute-tree` Endpoint

This section provides example payloads demonstrating the structure expected for different scenarios when using the `/execute-tree` API. 

### 1. Simple SMS Action

This example sends an SMS to a specified phone number.

```json
{
  "type": "SendSMS",
  "phoneNumber": "+1234567890"
}
```

### 2. Simple Email Action

This example sends an email from the specified sender to the receiver.

```json
{
  "type": "SendEmail",
  "sender": "noreply@example.com",
  "receiver": "user@example.com"
}
```

### 3. Condition Node

This example demonstrates a conditional action based on a JavaScript expression. If the condition evaluates to `true`, it sends an SMS. Otherwise, it sends an email.

```json
{
  "type": "Condition",
  "expression": "new Date().getFullYear() === 2024",
  "trueAction": {
    "type": "SendSMS",
    "phoneNumber": "+1234567890"
  },
  "falseAction": {
    "type": "SendEmail",
    "sender": "noreply@example.com",
    "receiver": "user@example.com"
  }
}
```

### 4. Loop Node

This example demonstrates a loop node that executes a subtree 3 times. The subtree checks a condition and sends an SMS if the condition is `true`.

```json
{
  "type": "Loop",
  "iterations": 3,
  "subtree": {
    "type": "Condition",
    "expression": "new Date().getDate() === 1",
    "trueAction": {
      "type": "SendSMS",
      "phoneNumber": "+1234567890"
    }
  }
}
```

### 5. Complex Decision Tree

This payload shows a more complex decision tree combining conditions, loops, and actions.

```json
{
  "type": "Condition",
  "expression": "new Date().getMonth() === 11",
  "trueAction": {
    "type": "Loop",
    "iterations": 5,
    "subtree": {
      "type": "SendEmail",
      "sender": "holiday@example.com",
      "receiver": "user@example.com"
    }
  },
  "falseAction": {
    "type": "SendSMS",
    "phoneNumber": "+1234567890"
  }
}
```

To optimize your Docker image size, a multi-stage build is indeed a great approach. By separating the build process and the final runtime environment, you can exclude unnecessary build tools and dependencies from the final image, resulting in a smaller, leaner image.

Here's how you can modify your Dockerfile to use multi-stage builds:

```dockerfile
# Use an official Node image as the build stage
FROM node:22.9.0-slim AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN npm run build


# Use a smaller image for the final stage
FROM node:22.9.0-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Expose port 8080
EXPOSE 8080

# Start the app
CMD ["npm", "run", "start"]
```

### Explanation
1. **Build Stage (`build`)**: x
   - The `build` stage compiles your TypeScript files and installs all dependencies. This stage includes all tools necessary for building the application.
   - All files are copied over, and the `npm run build` command is executed to generate your production files.

2. **Final Stage**: 
   - The second `FROM` statement starts a new, clean image layer. Only the `dist` directory (the output of the build), `node_modules`, and necessary package files are copied from the `build` stage.
   - This reduces the image size because development dependencies and build tools are excluded from the final image.

### Additional Optimizations
- **Use `npm ci` for Reproducible Builds**: Ensures the same dependencies are installed as specified in the `package-lock.json`.
- **Minimize Node Version**: Consider a smaller base image, such as `node:slim` or `node:alpine`, for the runtime stage if it meets your app's requirements.
  
This multi-stage approach keeps your image slim by ensuring only what's necessary for running the application is included in the final image.