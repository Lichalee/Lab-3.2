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
  { id: 1, name: 'Ralph Lauren Classic Fit Polo Shirt', price: 6790, currency: "THB" },
  { id: 2, name: 'Polo Ralph Lauren Custom Slim Fit Polo', price: 2390, currency: "THB" },
  { id: 3, name: 'Ralph Lauren Big Pony Polo Shirt', price: 1350, currency: "THB" },
];

// Routes

//check status
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Get all products
app.get('/products', (req, res) => res.json(product));

// Get product by ID
app.get('/products/:id', (req, res) => {
    const foundProduct = product.find(p => p.id === parseInt(req.params.id));
    if (!foundProduct) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        res.json(foundProduct);
    }
});

// Create a new product (POST)
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
    }
    const newProduct = {
        id: product.length > 0 ? Math.max(...product.map(p => p.id)) + 1 : 1,
        name,
        price,
        currency: "THB"
    };
    product.push(newProduct);
    res.status(201).json(newProduct);
});

// Update a product (PUT)
app.put('/products/:id', (req, res) => {
    const productData = product.find(p => p.id === parseInt(req.params.id));
    if (!productData) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const { name, price, currency } = req.body;
    if (name !== undefined) productData.name = name;
    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ message: 'Price must be a positive number' });
        }
        productData.price = price;
    }
    if (currency !== undefined) productData.currency = currency;
    res.json(productData);
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
