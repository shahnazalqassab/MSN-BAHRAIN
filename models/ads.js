const mongoose  = require('mongoose');

const AdsSchema = new mongoose.Schema({
        img: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        condition: { type: String, enum: ['new', 'used'], required: true },
        category: { type: String, enum: ['books', 'phones', 'cars', 'spare parts', 'laptop']},
        owner: {
            type: mongoose.Schema.Types.ObjectId, // LINKING THIS FIELD TO ANOTHER MODEL
            ref: 'User',
        }
        },{
            timestamps: true
        })

const Ads = mongoose.model('Ads', AdsSchema);

module.exports = Ads;