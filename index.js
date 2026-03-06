const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// IMPORTANT: ใช้ชื่อ products (พหูพจน์) สำหรับ array เก็บข้อมูล
let products = [
  { id: 1, name: 'Ralph Lauren Classic Fit Polo Shirt', price: 125.00 },
  { id: 2, name: 'Polo Ralph Lauren Custom Slim Fit Polo', price: 145.00 },
  { id: 3, name: 'Ralph Lauren Big Pony Polo Shirt', price: 135.00 },
];

// Routes
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// GET all products
app.get('/products', (req, res) => {
    res.json(products);
});

// GET product by ID
app.get('/products/:id', (req, res) => {
    const foundProduct = products.find(p => p.id === parseInt(req.params.id));
    
    if (!foundProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(foundProduct);
});

// POST new product
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }
    
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price: parseFloat(price)
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT update product
app.put('/products/:id', (req, res) => {
    const foundProduct = products.find(p => p.id === parseInt(req.params.id));
    
    if (!foundProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }
    
    const { name, price } = req.body;
    
    if (name) foundProduct.name = name;
    if (price) foundProduct.price = parseFloat(price);
    
    res.json(foundProduct);
});

// DELETE product
app.delete('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    
    const deletedProduct = products.splice(index, 1);
    res.json({ message: 'Product deleted', product: deletedProduct[0] });
});

app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
});