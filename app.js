import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'

const app = express();
const PORT = process.env.PORT || 5000

dotenv.config()

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello todo')
})

const manageDatabase = () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log('Connected successfully to mongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB');

    }

    const todoSchema = new mongoose.Schema({
        text: { type: String, required: true },
        isCompleted: { type: Boolean, default: false }
    });

    const Todo = mongoose.model('Todo', todoSchema);

    app.post('/todos', async (req, res) => {
        try {
            const todo = new Todo({
                text: req.body.text
            });
            const savedTodo = await todo.save()

            res.status(201).json(savedTodo)
        } catch (error) {
            res.status(500).json({ error: "Error creating todo" })
        }
    });

    app.get('/todos', async(req, res)=>{
        try {
            const todos = await Todo.find()
            res.status(200).json(todos)
        } catch (error) {
          res.status(500).json({error: 'Error fetching todos'})  
        }
    });

    app.put('/todos/:id', async(req, res)=>{
        try {
            const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if(!updatedTodo){
                return res.status(404).json({error: 'Todo not updated'})
            }
            res.status(200).json(updatedTodo)
        } catch (error) {
            res.status(500).json({error: 'Error updating todos'})
        }
    });

    app.delete('/todos/:id', async(req, res)=>{
        try {
            const deletedTodos = await Todo.findByIdAndDelete(req.params.id);
            if(!deletedTodos){
                return res.status(404).json({error: 'Todo not found'})
            }
            res.status(200).json({message: 'Todo deleted successfully'})
        } catch (error) {
            res.status(500).json({error: 'Error deleting todo'})
        }
       
    })

}

manageDatabase()

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})