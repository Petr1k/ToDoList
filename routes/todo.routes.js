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
    const {task, id} = req.body;
    
    try {
        let query, params;
        
        if (id) {
            query = "SELECT * FROM todo WHERE id = $1;";
            params = [id];
        } else if (task) {
            query = "SELECT * FROM todo WHERE task = $1;";
            params = [task];
        } else {
            return res.status(400).json({message: "Please provide either 'id' or 'task'"});
        }
        
        const data = await db.query(query, params);

        if(data.rows.length === 0) {
            return res.status(404).json({message: "there is no such task"});
        }
        
        const deleteQuery = id ? "DELETE FROM todo WHERE id = $1;" : "DELETE FROM todo WHERE task = $1;";
        const result = await db.query(deleteQuery, params);
        res.status(200).json({message: `${result.rowCount} row was deleted.`});
    }
    catch(error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
});

module.exports = router; 