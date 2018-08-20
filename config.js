export default {
	secret: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	mongo: {
		development: {
			connectionString: 'mongodb://127.0.0.1:27017/yzt'
		},
		production: {
			connectionString: 'mongodb://127.0.0.1:27017/yzt'
		}
	},
	redis: {
		development: {
			connectionString: 'redis://127.0.0.1:6379',
			password:123456
		},
		production: {
			connectionString: 'redis://127.0.0.1:6379',
			password:123456
		}
	},
	upload: {
		tmp : 'public/tmp/',
		path: 'public/uploads/'
	},
	superAdmin: {
		username: 'admin', 
		password: '123456', 
	},
	orderStatus: {
		'submitted': '已提交', 
		'canceled' : '已取消', 
		'confirmed': '已确认', 
		'finished' : '已完成', 
	},
	wechat: {
		appid: 'wx4ec54c44008298ec', 
		secret: '8295e6dd753aab17624e0bb0e1c4e98d', 
	},
}