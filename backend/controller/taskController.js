import Task from "../models/taskSchema.js";
import {json, request} from "express";
import mongoose from "mongoose";

export const addTask = async (req,res) => {
    try{
        const {day , week ,title, description, difficulty, status } = req.body;
        console.log(Task);
        console.log(req.body);
        const newTask = await Task.create({
            day,
            week,
            title,
            description,
            difficulty,
            status
        });

        res.status(201).json({
            success: true,
            message: "Task is Created",
            data: newTask
        })

    }catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Error When task Created"
        })
    }
}

export const getTask = async (req,res) => {
    try{
        const task = await Task.find();
        const taskCount = await Task.countDocuments();
        res.status(200).json({
            success: true,
            count: taskCount,
            message: "Get all Task",
            data: task
        })
    }catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Error When Get all Task"
        })
    }
}

export const getTaskById = async (req,res) => {
    try{
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({
                success: false,
                message: "This id is Not Found in database"
            })
        }
        const getTaskByID = await Task.findById(id);
        if(!getTaskByID){
            return res.status(404).json({
                success: false,
                message: "Task is not in database"
            })
        }
        res.status(200).json({
            success: true,
            message: "Get a Specific Task",
            data: getTaskByID
        })
    }catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Error When Get Task By Id"
        })
    }
}

export const updateTask = async (req,res) => {
    try{
        const {id} = req.params;
        const {day , week ,title, description, difficulty, status} = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "This id is Not Found in database"
            })
        }

        const updatetask = await Task.findByIdAndUpdate(id,{
            day,
            week,
            title,
            description,
            difficulty,
            status
        },{new: true, runValidators: true});

        if(!updatetask){
            return res.status(404).json({
                success: false,
                message: "Task is not Found in database "
            })
        }
        res.status(200).json({
            success: true,
            message: "Task is updated",
            data: updatetask
        })
    }catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Error When Task Update"
        })
    }
}

export const deleteTask = async (req,res) => {
    try{
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "This id is Not Found in database"
            })
        }

        const deletetask = await Task.findByIdAndDelete(id);

        if(!deletetask){
            return res.status(404).json({
                success: false,
                message: "Task is not in database"
            })
        }

        res.status(200).json({
            success: true,
            message: "Task is Deleted",
            data: deletetask
        })

    }catch (e) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}