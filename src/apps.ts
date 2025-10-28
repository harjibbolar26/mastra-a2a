import express from "express";
import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
    res.json({
        message: "HNG what do you have for me?. Visit /me to get started."
    })
})

export default app