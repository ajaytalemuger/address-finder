/**
 * Script to delete 'dist' folder in server inorder to have a clean build.
 */
const fs = require("fs");

const filePath = "./dist";

try {
  fs.rmSync(filePath, { recursive: true, force: true });
  console.log("Successfully deleted dist folder from server");
} catch (err) {
  console.log("Error while removing dist from server", err);
}
