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
        res.json({ message: '🗑️ Tarea eliminada', todo: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports={getAll, create, update, deleteTask};