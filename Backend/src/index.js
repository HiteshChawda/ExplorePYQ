import connectDB from './db/dbconnect.js';
import {app} from './app.js';
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

connectDB()
.then(() => {

    app.on("error", (error) => {
        console.log("Error starting the server:", error);
    }),

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((error) => {
    console.log("Error connecting to database !!", error);
})