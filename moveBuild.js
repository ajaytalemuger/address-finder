/**
 * Script to move 'build' folder generated in client to server so that is can be served as static files from it.
 */
const fs = require("fs");

const folderPath = "./client/build";
const newFolderPath = "./server/dist/build";

fs.rename(folderPath, newFolderPath, (err) => {
    if (err) {
        console.log("Error while moving build folder from client to server", err);
    } else {
        console.log("Successfully moved build folder from client to server");
    }
});