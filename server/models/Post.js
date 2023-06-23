import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: {
        type: String,
        required: true    
    },
    category:{
        type: String        
    },
    body:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model('Post', PostSchema);

export default Post;