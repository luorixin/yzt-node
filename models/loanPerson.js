import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	name:String,
	tel:Number,
	id_card:String,
	social_code:Number,
	stock_percent:Boolean,
	address_province:String,
	address_city:String,
	address_district:String,
	address_detail:String,
	company_name:String,
	create_user:{
		type:ObjectId,
		ref:'user',
	},
	create_at: {
		type   : Date,
		default: Date.now(),
	},
	update_at: Date,
})

export default mongoose.model('loanPerson', Schema)