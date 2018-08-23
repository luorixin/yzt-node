import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	name:String,
	tel:Number,
	id_card:String,
	id_card_pic_front:String,
	id_card_pic_back:String,
	social_code:Number,
	stock_percent:Boolean,
	address_province:String,
	address_city:String,
	address_district:String,
	address_detail:String,
	company_name:String,
	status:{
		type:Number,
		default:0,
	},
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