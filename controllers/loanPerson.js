import proxy from '../proxy'

class LoanPerson{
	constructor(app){
		Object.assign(this, {
			app,
			model: proxy.loanPerson,
		})
		this.init();
	}

	init(){
		this.routes()
	}

	routes(){
		this.app.get('/api/loanPerson', this.getAll.bind(this))
		this.app.get('/api/loanPerson/:id', this.get.bind(this))
		this.app.post('/api/loanPerson', this.post.bind(this))
		this.app.put('/api/loanPerson/:id', this.put.bind(this))
		this.app.delete('/api/loanPerson/:id', this.delete.bind(this))
		this.app.get('/api/loanPerson/search/all', this.search.bind(this))
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
	 * @api {get} /loanPerson 列出所有资源
	 * @apiDescription 列出所有资源
	 * @apiName getAll
	 * @apiGroup loanPerson
	 * 
	 * @apiParam {String} [page=1] 指定第几页
	 * @apiParam {String} [limit=10] 指定每页的记录数
	 *
	 * @apiPermission none
	 * @apiSampleRequest /loanPerson
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
	 *       	"name": "name",
	 *       	"id_card": "id_card",
	 *       	"id_card_pic_front": "id_card_pic_front",
	 *       	"id_card_pic_back": "id_card_pic_back",
	 *       	"status": "status",
	 *       	"social_code": "social_code",
	 *       	"stock_percent": "stock_percent",
	 *       	"address_province": "address_province",
	 *       	"address_city": "address_city",
	 *       	"address_district": "address_district",
	 *       	"address_detail": "address_detail",
	 *       	"company_name": "company_name",
	 *       	"create_user": "create_user",
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

		if (req.query.userId) {
			query.create_user = req.query.userId
		}

		if (req.query.name) {
			query.name = req.query.name
		}

		const params = {
			query  : query, 
			fields : {}, 
			options: opts, 
		}

		const options = {
			path    : 'create_user', 
			select  : {}, 
		}

		Promise.all([
			this.model.countAsync(query), 
			this.model.findAndPopulateAsync(params, options), 
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
	 * @api {get} /loanPerson/:id 获取某个指定资源的信息
	 * @apiDescription 获取某个指定资源的信息
	 * @apiName get
	 * @apiGroup loanPerson
	 *
	 * @apiParam {String} id 资源ID
	 *
	 * @apiPermission none
	 * @apiSampleRequest /loanPerson/:id
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
	 *       	"name": "name",
	 *       	"id_card": "id_card",
	 *       	"id_card_pic_front": "id_card_pic_front",
	 *       	"id_card_pic_back": "id_card_pic_back",
	 *       	"status": "status",
	 *       	"social_code": "social_code",
	 *       	"stock_percent": "stock_percent",
	 *       	"address_province": "address_province",
	 *       	"address_city": "address_city",
	 *       	"address_district": "address_district",
	 *       	"address_detail": "address_detail",
	 *       	"company_name": "company_name",
	 *       	"create_user": "create_user",
	 *       	"create_at": "create_at",
	 *       	"update_at": "update_at"
	 *       }
	 *     }
	 */
	get(req, res, next) {
		const params = {
			query  : {
				_id: req.params.id
			},
			fields : {}, 
			options: {}, 
		}

		const options = {
			path    : 'create_user', 
			select  : {}, 
		}

		this.model.findOneAndPopulateAsync(params, options)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '调用成功', doc)
		})
		.catch(err => next(err))
	}

	/**
	 * @api {post} /loanPerson 新建一个资源
	 * @apiDescription 新建一个资源
	 * @apiName post
	 * @apiGroup loanPerson
	 *
	 * @apiParam {String} name 申请人姓名
	 * @apiParam {Number} tel 申请人手机号码
	 * @apiParam {String} id_card 申请人身份证
	 * @apiParam {String} id_card_pic_front 申请人身份证正面照片
	 * @apiParam {String} id_card_pic_back 申请人身份证反面照片
	 * @apiParam {Number} status 申请人状态
	 * @apiParam {String} social_code 申请人社会代码
	 * @apiParam {String} stock_percent 股份是否占比超过40%
	 * @apiParam {String} address_province 家庭地址
	 * @apiParam {String} address_city 家庭地址
	 * @apiParam {String} address_district 家庭地址
	 * @apiParam {String} address_detail 家庭地址
	 * @apiParam {String} company_name 公司名字
	 * @apiParam {ObjectID} create_user 创建人
	 *
	 * @apiPermission none
	 * @apiSampleRequest /loanPerson
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
			name  : req.body.name, 
			tel:req.body.tel,
			stock_percent: req.body.stock_percent, 
			address_province : req.body.address_province, 
			address_city : req.body.address_city, 
			address_district : req.body.address_district, 
			address_detail : req.body.address_detail, 
			company_name : req.body.company_name, 
			create_user : req.body.create_user, 
		}
		if (req.body.id_card) {
			body.id_card = req.body.id_card
		};
		if (req.body.id_card_pic_front) {
			body.id_card_pic_front = req.body.id_card_pic_front
		};
		if (req.body.id_card_pic_back) {
			body.id_card_pic_back = req.body.id_card_pic_back
		};
		if (typeof req.body.status!='undefined' && req.body.status!='') {
			body.status = req.body.status
		};
		if (req.body.social_code) {
			body.social_code = req.body.social_code
		};
		this.model.post(body)
		.then(doc => res.tools.setJson(0, '新增成功', {_id: doc._id}))
		.catch(err => next(err))
	}

	/**
	 * @api {put} /loanPerson/:id 更新某个指定资源的信息
	 * @apiDescription 更新某个指定资源的信息
	 * @apiName put
	 * @apiGroup loanPerson
	 *
	 * @apiParam {String} id 资源ID
	 * @apiParam {String} name 申请人姓名
	 * @apiParam {Number} tel 申请人手机号码
	 * @apiParam {String} id_card 申请人身份证
	 * @apiParam {String} id_card_pic_front 申请人身份证正面照片
	 * @apiParam {String} id_card_pic_back 申请人身份证反面照片
	 * @apiParam {Number} status 申请人状态
	 * @apiParam {String} social_code 申请人社会代码
	 * @apiParam {String} stock_percent 股份是否占比超过40%
	 * @apiParam {String} address_province 家庭地址
	 * @apiParam {String} address_city 家庭地址
	 * @apiParam {String} address_district 家庭地址
	 * @apiParam {String} address_detail 家庭地址
	 * @apiParam {String} company_name 公司名字
	 * @apiParam {ObjectID} create_user 创建人
	 *
	 * @apiPermission none
	 * @apiSampleRequest /loanPerson/:id
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
	 *       	"name": "name",
	 *       	"id_card": "id_card",
	 *       	"social_code": "social_code",
	 *       	"id_card_pic_front": "id_card_pic_front",
	 *       	"id_card_pic_back": "id_card_pic_back",
	 *       	"status": "status",
	 *       	"stock_percent": "stock_percent",
	 *       	"address_province": "address_province",
	 *       	"address_city": "address_city",
	 *       	"address_district": "address_district",
	 *       	"address_detail": "address_detail",
	 *       	"company_name": "company_name",
	 *       	"create_user": "create_user",
	 *       	"create_at": "create_at",
	 *       	"update_at": "update_at"
	 *       }
	 *     }
	 */
	put(req, res, next) {
		const query = {
			_id: req.params.id
		}

		const body = {
		}

		if (req.body.name) {
			body.name = req.body.name
		};
		if (req.body.tel) {
			body.tel = req.body.tel
		};
		if (typeof req.body.stock_percent != 'undefined' && req.body.stock_percent!='') {
			body.stock_percent = req.body.stock_percent
		};
		if (req.body.address_province) {
			body.address_province = req.body.address_province
		};
		if (req.body.address_city) {
			body.address_city = req.body.address_city
		};
		if (req.body.address_district) {
			body.address_district = req.body.address_district
		};
		if (req.body.address_detail) {
			body.address_detail = req.body.address_detail
		};
		if (req.body.company_name) {
			body.company_name = req.body.company_name
		};
		if (req.body.id_card) {
			body.id_card = req.body.id_card
		};
		if (req.body.id_card_pic_front) {
			body.id_card_pic_front = req.body.id_card_pic_front
		};
		if (req.body.id_card_pic_back) {
			body.id_card_pic_back = req.body.id_card_pic_back
		};
		if (typeof req.body.status != 'undefined' && req.body.status!='') {
			body.status = req.body.status
		};
		if (req.body.social_code) {
			body.social_code = req.body.social_code
		};

		this.model.put(query, body)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '更新成功', doc)
		})
		.catch(err => next(err))
	}

	/**
	 * @api {delete} /loanPerson/:id 删除某个指定资源
	 * @apiDescription 删除某个指定资源
	 * @apiName delete
	 * @apiGroup loanPerson
	 *
	 * @apiParam {String} id 资源ID
	 * @apiSampleRequest /loanPerson/:id
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
			_id: req.params.id
		}
		
		this.model.delete(query)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '删除成功')
		})
		.catch(err => next(err))
	}

	/**
	 * @api {search} /loanPerson/search/all 按关键词查询资源
	 * @apiDescription 按关键词查询资源
	 * @apiName search
	 * @apiGroup loanPerson
	 *
	 * @apiParam {String} keyword 关键词
	 * @apiSampleRequest /loanPerson/search/all
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
}


export default LoanPerson



