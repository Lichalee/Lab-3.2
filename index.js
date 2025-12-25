const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Sample data

let product = [
  { id: 1, name: 'Ralph Lauren Classic Fit Polo Shirt', price: 125.00 },
  { id: 2, name: 'Polo Ralph Lauren Custom Slim Fit Polo', price: 145.00 },
  { id: 3, name: 'Ralph Lauren Big Pony Polo Shirt', price: 135.00 },
];

// Routes

//check status
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Get all products
app.get('/products', (req, res) => res.json(product));

// Get product by ID
app.get('/products/:id', (req, res) => {
    const product = product.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        res.json(product);
    }
});

// Create a new product (POST)
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }
    const newProduct = {
        id: product.length > 0 ? Math.max(...product.map(p => p.id)) + 1 : 1,
        name,
        price
    };
    product.push(newProduct);
    res.status(201).json(newProduct);
});

// Update a product (PUT)
app.put('/products/:id', (req, res) => {
    const product = product.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const { name, price } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;
    res.json(product);
});

// Delete a product (DELETE)
app.delete('/products/:id', (req, res) => {
    const index = product.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const deletedProduct = product.splice(index, 1);
    res.json({ message: 'Product deleted', product: deletedProduct[0] });
});

app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
});