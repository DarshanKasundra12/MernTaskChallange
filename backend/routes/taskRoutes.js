import express,{Router} from "express";
import {addTask, getTask, getTaskById, updateTask, deleteTask} from "../controller/taskController.js";

const router = new Router();

router.post('/addtask', addTask);
router.get('/gettask', getTask);
router.get('/gettask/:id', getTaskById);
router.patch('/updatetask/:id', updateTask);
router.delete('/deletetask/:id', deleteTask);

export default router;