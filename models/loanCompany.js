import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	name: String,
	product:Array,
	spot_amount:Number,
	sell_amount:Number,
	address_province:String,
	address_city:String,
	address_district:String,
	address_detail:String,
	loan_person:{
		type:ObjectId,
		ref:"loanPerson"
	},
	sales_customer:Array,
	create_at: {
		type   : Date,
		default: Date.now(),
	},
	update_at: Date,
})

export default mongoose.model('loanCompany', Schema)