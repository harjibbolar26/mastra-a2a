import dotenv from "dotenv"
import app from "./app";

dotenv.config()

const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
    console.log(`Server running successfully on http://localhost:${PORT}`)
})