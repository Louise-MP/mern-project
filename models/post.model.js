const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true
        },
        
        message: {
            type: String,
            trim: true,
            maxlength: 500
        },

        picture: {
            type: String
        },

        video: {
            type: String
        },

        likers: {  
            type: [String], // tableau qui regroupe les id des personnes qui ont liké le post 
            required: true
        },
        
        comments: { // sous base de donnée
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String,
                    timestamp: Number 
                }
            ],
            required: true,
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model('post', PostSchema);