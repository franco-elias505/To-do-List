const {pool}=require('../db');
const getAll= async(req,res)=>{
    try {
        const result = await pool.query(
            'SELECT *FROM todos ORDER BY order_index ASC' );
            res.json(result.rows);
        } catch(erro) {
            res.status(500).json({error:erro.message});
        }
};
const create= async(req,res)=>{
    try{
    const { title, notes, due_date, priority } = req.body;
    const result = await pool.query(
        'INSERT INTO todos (title, notes, due_date, priority)VALUES( $1,$2,$3,$4)RETURNING*',
         [title,notes,due_date,priority]
    ); res.status(201).json(result.rows[0]);
    }catch(erro){
        res.status(500).json({error:erro.mesage});
    }
};
const update= async(req, res)=>{
    try{
        const{id}=req.params;
        const{title,completed,notes, due_date, priority}= req.body;
        const result=await pool.query(
            'UPDATE todos SET title=$1, completed=$2,notes=$3, due_date=$4, priority=$5 WHERE id=$6 RETURNING*',
            [title,completed,notes,due_date,priority,id]
        ); if(result.rows.length===0){
          return res.status(404).json({error:'Tarea no encontrada'});
        }
        res.json(result.rows[0]);
        }catch(erro){
            res.status(500).json({error:erro.message});
        }
}; 
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM todos WHERE id=$1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json({ message: ' Tarea eliminada', todo: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const patch = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed, order_index, notes, dueDate, priority } = req.body;

        const result = await pool.query(
            `UPDATE todos SET
                title        = COALESCE($1, title),
                completed    = COALESCE($2, completed),
                order_index  = COALESCE($3, order_index),
                notes        = COALESCE($4, notes),
                due_date     = COALESCE($5, due_date),
                priority     = COALESCE($6, priority)
             WHERE id=$7
             RETURNING *`,
            [title, completed, order_index, notes, dueDate, priority, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM todos WHERE id=$1', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const deleteCompleted = async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM todos WHERE completed=1 RETURNING *'
        );
        res.json({ 
            message: ` ${result.rowCount} tareas completadas eliminadas`,
            todos: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const completeAll = async (req, res) => {
    try {
        await pool.query('UPDATE todos SET completed = 1');
        res.json({ message: 'All tasks completed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const deleteAll = async (req, res) => {
    try {
        await pool.query('DELETE FROM todos');
        res.json({ message: 'All todos deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports={getAll, create, update, deleteTask, patch, getById, deleteCompleted, completeAll, deleteAll};