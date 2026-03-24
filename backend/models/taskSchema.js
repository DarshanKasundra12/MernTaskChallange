import mongoose, {Schema} from "mongoose";

const taskSchema = new Schema({
    day: {type: Number,required: true, min: 1, max: 20},
    week: {type: String, required: true, min: 1, max: 4},
    title: {type: String, required: true},
    description: {type: String},
    difficulty: {type: String, enum: ['Easy', 'Hard', 'Medium'], default: 'Easy'},
    status: {type: String, enum: ['Created', 'Ongoing', 'Completed'], default: 'Created'},

});

const Task = mongoose.model("TaskSchema", taskSchema);

export default Task;