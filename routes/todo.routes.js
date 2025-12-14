const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM todo;');
        res.status(200).json({todo: data.rows});
    }
    catch(error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const { task } = req.body;

    try {
        const data = await db.query('INSERT INTO todo (task) VALUES ($1) RETURNING *;', [task]);
        console.log(data);
        res.status(201).json({message: `${data.rowCount} row inserted.`, todo: data.rows[0]});
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    } 
});

router.delete('/', async (req, res) => {
    const {task} = req.body;
    
    try {
        const data = await db.query("SELECT * FROM todo WHERE task = $1;", [task]);

        if(data.rows.length === 0) {
            return res.status(404).json({message: "there is no such task"});
        }
        
        const result = await db.query("DELETE FROM todo WHERE task = $1;", [task]);
        res.status(200).json({message: `${result.rowCount} row was deleted.`});
    }
    catch(error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
});

module.exports = router; 