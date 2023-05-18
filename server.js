const express = require("express")
const app = express()


const router = require("./router/route")
app.use("/api", router)


app.listen(5001, () => console.log(`http://localhost:5001`))