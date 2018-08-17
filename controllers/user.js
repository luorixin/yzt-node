import request from 'request'
import config from '../config'
import jwt from '../common/jwtauth'
import proxy from '../proxy'
import jwtauth from '../middlewares/jwtauth'

class User{
	constructor(app){
		Object.assign(this,{
			app,
			model:proxy.user
		})
	}

	init(){
		this.routes();
		this.initSuperAdmin();
	}

	/**
	 * 注册路由
	 */
	routes(){
		this.app.get('/api/user', this.getAll.bind(this))
		this.app.get('/api/user/:username', this.get.bind(this))
		this.app.post('/api/user', this.post.bind(this))
		this.app.put('/api/user/:username', this.put.bind(this))
		this.app.delete('/api/user/:username', this.delete.bind(this))

		this.app.post('/api/user/reset/password', this.resetPassword.bind(this))
		this.app.post('/api/user/sign/up', this.signUp.bind(this))
		this.app.post('/api/user/sign/in', this.signIn.bind(this))
		this.app.post('/api/user/sign/out', this.signOut.bind(this))
	}
	/**
	 * @apiDefine Header
	 * @apiHeader {String} Authorization jsonwebtoken
	 */
	
	/**
	 * @apiDefine Success
	 * @apiSuccess {Object} meta 状态描述
	 * @apiSuccess {Number} meta.code 标识码，0表示成功，1表示失败
	 * @apiSuccess {String} meta.message 标识信息
	 * @apiSuccess {Object} data 数据内容
	 */
	
	/**
	 * @api {get} /user 列出所有资源
	 * @apiDescription 列出所有资源
	 * @apiName getAll
	 * @apiGroup user
	 * 
	 * @apiParam {String} [page=1] 指定第几页
	 * @apiParam {String} [limit=10] 指定每页的记录数
	 *
	 * @apiPermission none
	 * @apiSampleRequest /user
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "调用成功"
	 *       },
	 *       "data": [{
	 *       	"_id": "_id",
	 *       	"username": "username",
	 *       	"password": "password",
	 *       	"avatar": "avatar",
	 *       	"tel": "tel",
	 *       	"email": "email",
	 *			"nickname": "nickname",
	 *			"gender": "gender",
	 *			"birthday": "birthday",
	 *       	"create_at": "create_at",
	 *       	"update_at": "update_at"
	 *       }]
	 *     }
	 */	
	getAll(req, res, next) {
		const query = {}

		const opts = {
			page : req.query.page, 
			limit: req.query.limit
		}

		const params = {
			query  : query, 
			fields : {}, 
			options: opts, 
		}

		Promise.all([
			this.model.countAsync(query), 
			this.model.findAsync(params), 
		])
		.then(docs => {
			res.tools.setJson(0, '调用成功', {
				items   : docs[1], 
				paginate: new res.paginate(Number(opts.page), Number(opts.limit), docs[0]).item, 
			})
		})
		.catch(err => next(err))
	}
	
	/**
	 * @api {get} /user/:username 获取某个指定资源的信息
	 * @apiDescription 获取某个指定资源的信息
	 * @apiName get
	 * @apiGroup user
	 *
	 * @apiParam {String} username 资源ID
	 *
	 * @apiPermission none
	 * @apiSampleRequest /user/:username
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "调用成功"
	 *       },
	 *       "data": {
	 *       	"_id": "_id",
	 *       	"username": "username",
	 *       	"password": "password",
	 *       	"avatar": "avatar",
	 *       	"tel": "tel",
	 *       	"email": "email",
	 *			"nickname": "nickname",
	 *			"gender": "gender",
	 *			"birthday": "birthday",
	 *       	"create_at": "create_at",
	 *       	"update_at": "update_at"
	 *       }
	 *     }
	 */
	get(req, res, next) {
		const params = {
			query  : {
				username: req.params.username
			},
			fields : {}, 
			options: {}, 
		}


		this.model.findOneAsync(params)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '调用成功', doc)
		})
		.catch(err => next(err))
	}

	/**
	 * @api {post} /user 新建一个资源
	 * @apiDescription 新建一个资源
	 * @apiName post
	 * @apiGroup user
	 *
	 * @apiParam {String} username 名称
	 * @apiParam {Number} tel 电话
	 * @apiParam {String} password 密码
	 * @apiParam {String} avatar 图片
	 * @apiParam {String} email 邮箱
	 * @apiParam {String} nickname 昵称
	 * @apiParam {String} gender 性别
	 * @apiParam {String} birthday 生日
	 *
	 * @apiPermission none
	 * @apiSampleRequest /user
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "新增成功"
	 *       },
	 *       "data": {
	 *       	"_id": "_id"
	 *       }
	 *     }
	 */
	post(req, res, next) {
		const body = {
			username  : req.body.username, 
			password : req.body.password, 
			tel: req.body.tel, 
			avatar: req.body.avatar, 
			email : req.body.email, 
			nickname : req.body.nickname,
			gender : req.body.gender,
			birthday : req.body.birthday,   
		}

		this.model.post(body)
		.then(doc => res.tools.setJson(0, '新增成功', {_id: doc._id}))
		.catch(err => next(err))
	}

	/**
	 * @api {put} /user/:username 更新某个指定资源的信息
	 * @apiDescription 更新某个指定资源的信息
	 * @apiName put
	 * @apiGroup user
	 *
	 * @apiParam {String} username 资源ID
	 * @apiParam {String} [nickname] 昵称
	 * @apiParam {String} [password] 密码
	 * @apiParam {String} [avatar] 头像
	 * @apiParam {String} [tel] 手机号
	 * @apiParam {String} [email] 邮箱
	 * @apiParam {String} [gender] 性别
	 * @apiParam {String} [birthday] 生日
	 *
	 * @apiPermission none
	 * @apiSampleRequest /user/:username
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "更新成功"
	 *       },
	 *       "data": {
	 *       	"_id": "_id",
	 *       	"username": "username",
	 *       	"avatar": "avatar",
	 *       	"tel": "tel",
	 *       	"email": "email",
	 *			"nickname": "nickname",
	 *			"gender": "gender",
	 *			"birthday": "birthday",
	 *       	"create_at": "create_at",
	 *       	"update_at": "update_at"
	 *       }
	 *     }
	 */
	put(req, res, next) {
		const query = {
			username: req.params.username
		}

		const body = {
			username  : req.body.username,  
			tel: req.body.tel, 
			avatar: req.body.avatar, 
			email : req.body.email, 
			nickname : req.body.nickname,
			gender : req.body.gender,
			birthday : req.body.birthday,   
		}

		this.model.put(query, body)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '更新成功', doc)
		})
		.catch(err => next(err))
	}

	/**
	 * @api {post} /user/reset/password 修改密码
	 * @apiDescription 修改密码
	 * @apiName resetPassword
	 * @apiGroup user
	 *
	 * @apiParam {String} oldpwd 旧密码
	 * @apiParam {String} newpwd 新密码
	 * 
	 * @apiPermission none
	 * @apiSampleRequest /user/reset/password
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "更新成功"
	 *       },
	 *       "data": null
	 *     }
	 */
	resetPassword(req, res, next) {
		const oldpwd = req.body.oldpwd
		const newpwd = req.body.newpwd
			
		if (oldpwd && newpwd) {
			this.model.findByNameAsync(req.user.username)
			.then(doc => {
				if (!doc) return res.tools.setJson(1, '用户不存在或已删除')
				if (doc.password !== res.jwt.setMd5(oldpwd)) return res.tools.setJson(1, '密码错误')
				doc.password = res.jwt.setMd5(newpwd)
				return doc.save()
			})
			.then(doc => res.tools.setJson(0, '更新成功'))
			.catch(err => next(err))
		}
	}

	/**
	 * @api {delete} /user/:username 删除某个指定资源
	 * @apiDescription 删除某个指定资源
	 * @apiName delete
	 * @apiGroup user
	 *
	 * @apiParam {String} id 资源ID
	 * @apiSampleRequest /user/:username
	 * 
	 * @apiPermission none
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "删除成功"
	 *       },
	 *       "data": null
	 *     }
	 */
	delete(req, res, next) {
		const query = {
			username: req.params.username
		}
		
		this.model.delete(query)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '删除成功')
		})
		.catch(err => next(err))
	}

	/**
	 * @api {search} /user/search/all 按关键词查询资源
	 * @apiDescription 按关键词查询资源
	 * @apiName search
	 * @apiGroup user
	 *
	 * @apiParam {String} keyword 关键词
	 * @apiSampleRequest /user/search/all
	 * 
	 * @apiPermission none
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "调用成功"
	 *       },
	 *       "data": [{
	 *       	"_id": "_id",
	 *       	"num": "num",
	 *       }]
	 *     }
	 */
	search(req, res, next) {
		const keyword = req.query.keyword
		const pattern = keyword && new RegExp(keyword)

		this.model.model.aggregate([
			{
				$match: {
					name: pattern
				}
			},
			{
				$group: {
					_id: '$name',
					num: {
						$sum: 1
					}
				}
			}
		])
		.then(doc => res.tools.setJson(0, '调用成功', doc))
		.catch(err => next(err))
	}

	/**
	 * 创建超级管理员
	 */
	initSuperAdmin(req, res, next) {
		const username = config.superAdmin.username
		const password = config.superAdmin.password

		this.model.findByNameAsync(username)
		.then(doc => {
			if (!doc) return this.model.newAndSave({
				username: username, 
				password: jwt.setMd5(password), 
			})
		})
	}

	/**
	 * @api {post} /user/sign/up 用户注册
	 * @apiDescription 用户注册
	 * @apiName signUp
	 * @apiGroup user
	 *
	 * @apiParam {String} username 用户名
	 * @apiParam {String} password 密码
	 *
	 * @apiPermission none
	 * @apiSampleRequest /user/sign/up
	 * 
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "注册成功"
	 *       },
	 *       "data": null
	 *     }
	 */
	signUp(req, res, next) {
		const username = req.body.username
		const password = req.body.password

		if (!username || !password) return res.tools.setJson(1, '用户名或密码错误')
		
		this.model.findByNameAsync(username)
		.then(doc => {
			if (!doc) return this.model.newAndSave({
				username: username, 
				password: res.jwt.setMd5(password)
			})
			return res.tools.setJson(1, '用户名已存在')
		})
		.then(doc => res.tools.setJson(0, '注册成功'))
		.catch(err => next(err))
	}

	/**
	 * @api {post} /user/sign/in 用户登录
	 * @apiDescription 用户登录
	 * @apiName signIn
	 * @apiGroup user
	 *
	 * @apiParam {String} username 用户名
	 * @apiParam {String} password 密码
	 *
	 * @apiPermission none
	 * @apiSampleRequest /user/sign/in
	 * 
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "登录成功"
	 *       },
	 *       "data": {
	 *       	"token": "token"
	 *       }
	 *     }
	 */
	signIn(req, res, next) {
		const username = req.body.username
		const password = req.body.password
		
		if (!username || !password) return res.tools.setJson(1, '用户名或密码错误')	
		if (req.body.code !== req.session.code) return res.tools.setJson(1, '验证码错误')

		this.model.getAuthenticated(username, password)
		.then(doc => {
			switch (doc) {
	            case 0:
	            	res.tools.setJson(1, '用户名或密码错误')
	            	break
	            case 1:
	                res.tools.setJson(1, '用户名或密码错误')
	                break
	            case 2:
	                res.tools.setJson(1, '账号已被锁定，请等待两小时解锁后重新尝试登录')
	                break
	            default: res.tools.setJson(0, '登录成功', {
					token: res.jwt.setToken(doc._id)
				})
	        }
		})
		.catch(err => next(err))	
	}

	/**
	 * @api {post} /user/sign/out 用户登出
	 * @apiDescription 用户登出
	 * @apiName signOut
	 * @apiGroup user
	 *
	 * @apiPermission none
	 * @apiSampleRequest /user/sign/out
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "登出成功"
	 *       },
	 *       "data": null
	 *     }
	 */
	signOut(req, res, next) {
		if (req.user) {
			new jwtauth().expireToken(req.headers)
			delete req.user	
			delete this.app.locals.token
			return res.tools.setJson(0, '登出成功')
		}
		return res.tools.setJson(1, '登出失败')
	}

}
export default User