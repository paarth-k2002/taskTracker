This is the readme file for the Web & SOA Assignment-4. I have created a task manager project named "Task Tracker". The Project offers basic CRUD functionality like:

1. Creating a task.
2. Reading the task from the task list.
3. Updating the status of a task.
4. Deleting a task.

A task consist of various properties like:

1. Title
2. Description
3. Due Date (defaulted to current day date)
4. Status (In Progress or Completed)

The Project uses ReactJS on frontend, and Go on the backend, utilizing go packages like Fiber and Air for smoother development. For styling, i have used ChakraUI components as they come prestyled and do not have to tweak much.

The connected database is MongoDB Atlas. The project is yet to be deployed on a deployment platform like Vercel or Netlify.

The project showcases a fully working CRUD app with frontend to backend connection.

#### Setting up the project:

To build the GO backend:

1. Run `go mod tidy` to install go dependencies.
2. Enter the command `air` to start the air backend which has the connection with MongoDB Database pre-set with all the keys made and set up by me.

To build the ReactJS frontend:

1. Run `npm i` to install the required node modules and packages for the project.
2. Execute the `npm run dev` command to start the localhost server on port:5173 (default port).
3. Go to the designated port and then you can run the website.
