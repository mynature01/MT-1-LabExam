import express from 'express';

const app = express();

app.use(express.json());

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
    },
    {
        id: 3,
        vehicleName: "Maruti Swift",
        vehicleNumber: "DL8CAF5030",
        type: "Hatchback",
        price: 750000
    }
];

// Check vehicle details
function validVehicle(v) {
    return v.id !== undefined &&
        v.vehicleName &&
        v.vehicleNumber &&
        v.type &&
        typeof v.price === "number" &&
        v.price > 0;
}

// GET all vehicles
app.get('/vehicles', (req, res) => {
    res.json(vehicles);
});

// GET vehicle by ID
app.get('/vehicles/:id', (req, res) => {
    const vehicle = vehicles.find(v => v.id == req.params.id);

    if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(vehicle);
});

// POST add vehicle
app.post('/vehicles', (req, res) => {
    const vehicle = req.body;

    if (!validVehicle(vehicle)) {
        return res.status(400).json({ message: "Invalid vehicle details" });
    }

    if (vehicles.some(v => v.id == vehicle.id)) {
        return res.status(400).json({ message: "Vehicle ID already exists" });
    }

    vehicles.push(vehicle);

    res.status(201).json({
        message: "Vehicle added successfully",
        vehicle: vehicle
    });
});

// PUT update vehicle
app.put('/vehicles/:id', (req, res) => {
    const id = req.params.id;

    const index = vehicles.findIndex(v => v.id == id);

    if (index === -1) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    const updatedVehicle = {
        ...vehicles[index],
        ...req.body,
        id: vehicles[index].id
    };

    if (!validVehicle(updatedVehicle)) {
        return res.status(400).json({ message: "Invalid vehicle details" });
    }

    vehicles[index] = updatedVehicle;

    res.json({
        message: "Vehicle updated successfully",
        vehicle: updatedVehicle
    });
});

// DELETE vehicle
app.delete('/vehicles/:id', (req, res) => {
    const id = req.params.id;

    const index = vehicles.findIndex(v => v.id == id);

    if (index === -1) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicles.splice(index, 1);

    res.json({ message: "Vehicle deleted successfully" });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({ message: "Invalid JSON" });
    }

    res.status(500).json({ message: "Server error" });
});

// Invalid routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});