const data = require("./data.json")
const fs = require("fs")
const express = require("express")
const server = express()
const nunjucks = require("nunjucks")

server.use(express.static("public"))
server.use(express.urlencoded({extended:true}))
server.use(express.json());
server.set("view engine", "njk")
nunjucks.configure("views", {
    express:server,
    autoescape:false,
    noCache:true,
})

server.get("/", (request , response) => {
    return response.render("home",{data: data.dados})
})
server.post("/post", (request, response) => {
    const keys = Object.keys(request.body)

    for (key of keys) {
        if (request.body[key] == '') {
            return response.send("Please, fill all fields")
        }
    }
    let { name, email } = request.body

    const id = Number(data.dados.length + 1)

    data.dados.push({
        id,
        name,
        email,
    })
    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return response.send("White file error... :(")
        }
        return response.redirect("/")
    })
})
server.listen(3333)
