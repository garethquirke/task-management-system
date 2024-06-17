# task-management-system

Utilises Bootstrap, React frontend to manage a list of tasks retrieved from a local SQL DB served through .NET Core with logging middleware.

![image](https://github.com/garethquirke/task-management-system/assets/15104324/4c4c26c9-74c0-473b-bd90-48dcec6d7979)


Step 1.
Clone Repo locally

Step 2.
- Ensure .NET Core 8.0 SDK is installed
- Use this command to run the API locally: cd API && dotnet run
- URL to access Swagger for endpoint details is available once running: http://localhost:5208/swagger/index.html

Step 3.
- Open a new terimal window in the root of the project and change directory to the interface: cd UI
- If NPM is not installed please follow these steps: https://nodejs.org/en/download/package-manager
- Ensure yarn is installed, can be achieve with this command: npm install -g yarn
- Install dev dependencies such as Vite, Bootstrap with this command: yarn install
- Run the project locally with this command: yarn run dev
- Project should be available on the browser at: http://localhost:5173/

