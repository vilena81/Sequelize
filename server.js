
const express = require('express')
const Sequelize = require('sequelize')
const app = express()
app.use(express.json())
const sequelize = new Sequelize('mydb', null, null, { dialect: 'sqlite', storage: 'data.db' })


const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    price: Sequelize.INTEGER
})

Product.sync()
    .then(() => console.log('Table created successfully'))
    .catch((err) => console.log('Error creating table:', err));

app.get('/', (req, res) => {
    // Product.findAll({offset:3, limit:25}).then((prod) => {
        Product.findAll().then((prod) => {
        res.json(prod)
    }).catch((err) => {
        res.status(500).json({ error: err.message })
    })
})

app.post('/products', (req,res)=>{
    const {name,price}=req.body;
    Product.create({name,price}).then((prod)=>{
        res.status(201).json(prod)
    }).catch((err)=>{
        res.status(500).json({error:err.message})
    })
})

app.get('/products/:id', (req, res)=>{
    const prodId = req.params.id
    Product.findByPk(prodId).then((prod) => {
        res.json(prod)
    }).catch((err) => {
        res.status(500).json({ error:err.message })
    })
})

app.put('/products/update/:id', (req, res)=>{
    const {id}= req.params;
    const {name,price}=req.body;
    Product.update({name, price}, {where: {id} }).then(()=>{
        res.status(201).json("UPDATED")
    }).catch((err)=>{
        res.status(500).json({error:err.message})
    })
})




app.delete('/products/delete/:id', (req, res)=>{
    const prodId= req.params.id
    Product.destroy( {where:{ id:prodId } }).then(()=>{
        res.json("DELETED")
    }).catch((err)=>{
        res.status(500).json({error:err.message})
    })
})




app.listen(3000)