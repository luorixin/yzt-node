import bluebird from 'bluebird'
import mongoose from 'mongoose'
import mongoomise from 'mongoomise'

class Mongo{
	constructor(app,config){
		Object.assign(this,{
			app,
			config
		})
		this.init()
	}
	init(){
		this.env = this.app.get('env')
		this.dblink = this.config['mongo'][this.env]['connectionString']

		const opts = {
			server:{
				socketOptions:{
					keepAlive:1
				}
			}
		}
		mongoose
			.connect(this.dblink,opts)
			.connection
			.on('error',err => console.log('---mongo connect fail--'))
			.on('open',err => console.log('----mongo connect success ---'))

		mongoomise.promisifyAll(mongoose, bluebird)
	}
}

export default Mongo