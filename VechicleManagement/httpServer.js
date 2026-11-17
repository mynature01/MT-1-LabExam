import http from 'http';
import fs from 'fs';

let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Honda City",
        vehicleNumber: "UP14CD1234",
        type: "Sedan",
        price: 1200000
    }
];

const server = http.createServer((req, res) => {

    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Vehicle Management</h1>");
    }

    else if (req.url === "/vehicles" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(vehicles));
    }

    else if (req.url === "/about" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Vehicle Management Application using Node.js");
    }

    else if (req.url === "/info" && req.method === "GET") {
        fs.readFile("public/info.html", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error reading file");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        });
    }

    else if (req.url === "/add-vehicle" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                let vehicle = JSON.parse(body);

                if (
                    !vehicle.id ||
                    !vehicle.vehicleName ||
                    !vehicle.vehicleNumber ||
                    !vehicle.type ||
                    vehicle.price === undefined
                ) {
                    res.writeHead(400);
                    res.end("Missing required fields");
                    return;
                }

                vehicles.push(vehicle);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Vehicle added successfully",
                    vehicle: vehicle
                }));

            } catch (error) {
                res.writeHead(400);
                res.end("Invalid JSON");
            }
        });
    }

    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Page Not Found");
    }

});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});