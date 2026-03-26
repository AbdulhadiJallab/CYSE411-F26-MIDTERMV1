const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bodyParser = require("body-parser")
const app = express()
const db = new sqlite3.Database("portal.db")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
    `)
    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
        if (row.count === 0) {
            db.run(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                ["admin", "admin123"]
            )
            db.run(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                ["employee", "password"]
            )
        }
    })
})

app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    // FIXED: Parameterized query — user input is passed as separate
    // parameters and never concatenated into the SQL string.
    // The database driver treats them as pure data, so SQL
    // metacharacters cannot alter the query structure.
    const query = "SELECT * FROM users WHERE username = ? AND password = ?"

    console.log("\nExecuting SQL:")
    console.log(query)
    console.log("Parameters:", [username, password])

    db.all(query, [username, password], (err, rows) => {
        if (err) {
            return res.status(500).send("Database error")
        }
        if (rows && rows.length > 0) {
            res.send("Login success")
        } else {
            res.send("Login failed")
        }
    })
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})
