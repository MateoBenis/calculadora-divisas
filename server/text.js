import "dotenv/config"; // Automatically loads .env and calls dotenv.config()

console.log(process.env.DB_URI); // Should print the value from .env
