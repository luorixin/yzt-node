import proxy from '../proxy'

class LoanCompany{
	constructor(app){
		Object.assign(this, {
			app,
			model: proxy.loanCompany,
		})
		this.init();
	}

	init(){
		this.routes()
	}

	routes(){
		this.app.get('/api/loanCompany', this.getAll.bind(this))
		this.app.get('/api/loanCompany/:id', this.get.bind(this))
		this.app.post('/api/loanCompany', this.post.bind(this))
		this.app.put('/api/loanCompany/:id', this.put.bind(this))
		this.app.delete('/api/loanCompany/:id', this.delete.bind(this))
		this.app.get('/api/loanCompany/search/all', this.search.bind(this))
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
	 * @api {get} /loanCompany 列出所有资源
	 * @apiDescription 列出所有资源
	 * @apiName getAll
	 * @apiGroup loanCompany
	 * 
	 * @apiParam {String} [page=1] 指定第几页
	 * @apiParam {String} [limit=10] 指定每页的记录数
	 *
	 * @apiPermission none
	 * @apiSampleRequest /loanCompany
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
	 *       	"product": "product",
	 *       	"spot_amount": "spot_amount",
	 *       	"sell_amount": "sell_amount",
	 *       	"business_licence": "business_licence",
	 *       	"opening_permission": "opening_permission",
	 *       	"business_permission": "business_permission",
	 *       	"address_province": "address_province",
	 *       	"address_city": "address_city",
	 *       	"address_district": "address_district",
	 *       	"address_detail": "address_detail",
	 *       	"sales_customer": "sales_customer",
	 *       	"loan_person": "loan_person",
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

		if (req.query.loanPersonId) {
			query.loan_person = req.query.loanPersonId
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
			path    : 'loan_person', 
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
	 * @api {get} /loanCompany/:id 获取某个指定资源的信息
	 * @apiDescription 获取某个指定资源的信息
	 * @apiName get
	 * @apiGroup loanCompany
	 *
	 * @apiParam {String} id 资源ID
	 *
	 * @apiPermission none
	 * @apiSampleRequest /loanCompany/:id
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
	 *       	"product": "product",
	 *       	"spot_amount": "spot_amount",
	 *       	"sell_amount": "sell_amount",
	 *       	"business_licence": "business_licence",
	 *       	"opening_permission": "opening_permission",
	 *       	"business_permission": "business_permission",
	 *       	"address_province": "address_province",
	 *       	"address_city": "address_city",
	 *       	"address_district": "address_district",
	 *       	"address_detail": "address_detail",
	 *       	"sales_customer": "sales_customer",
	 *       	"loan_person": "loan_person",
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
			path    : 'loan_person', 
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
	 * @api {post} /loanCompany 新建一个资源
	 * @apiDescription 新建一个资源
	 * @apiName post
	 * @apiGroup loanCompany
	 *
	 * @apiParam {String} name 申请人姓名
	 * @apiParam {Array} product 企业主营产品
	 * @apiParam {String} spot_amount 垫付金额
	 * @apiParam {String} sell_amount 销售额
	 * @apiParam {String} business_licence 营业执照照片
	 * @apiParam {String} opening_permission 开户许可证
	 * @apiParam {String} business_permission 经营许可证
	 * @apiParam {String} address_province 家庭地址
	 * @apiParam {String} address_city 家庭地址
	 * @apiParam {String} address_district 家庭地址
	 * @apiParam {String} address_detail 家庭地址
	 * @apiParam {Array} sales_customer 销售客户
	 * @apiParam {ObjectID} loan_person 贷款人
	 *
	 * @apiPermission none
	 * @apiSampleRequest /loanCompany
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
			product : req.body.product, 
			spot_amount:req.body.spot_amount,
			sell_amount:req.body.sell_amount,
			address_province : req.body.address_province, 
			address_city : req.body.address_city, 
			address_district : req.body.address_district, 
			address_detail : req.body.address_detail, 
			sales_customer : req.body.sales_customer, 
			loan_person : req.body.loan_person, 
		}
		if (req.body.business_licence) {
			body.business_licence = req.body.business_licence
		};
		if (req.body.opening_permission) {
			body.opening_permission = req.body.opening_permission
		};
		if (req.body.business_permission) {
			body.business_permission = req.body.business_permission
		};
		this.model.post(body)
		.then(doc => res.tools.setJson(0, '新增成功', {_id: doc._id}))
		.catch(err => next(err))
	}

	/**
	 * @api {put} /loanCompany/:id 更新某个指定资源的信息
	 * @apiDescription 更新某个指定资源的信息
	 * @apiName put
	 * @apiGroup loanCompany
	 *
	 * @apiParam {String} id 资源ID
	 * @apiParam {String} name 申请人姓名
	 * @apiParam {Array} product 企业主营产品
	 * @apiParam {String} spot_amount 垫付金额
	 * @apiParam {String} sell_amount 销售额
	 * @apiParam {String} business_licence 营业执照照片
	 * @apiParam {String} opening_permission 开户许可证
	 * @apiParam {String} business_permission 经营许可证
	 * @apiParam {String} address_province 家庭地址
	 * @apiParam {String} address_city 家庭地址
	 * @apiParam {String} address_district 家庭地址
	 * @apiParam {String} address_detail 家庭地址
	 * @apiParam {Array} sales_customer 销售客户
	 * @apiParam {ObjectID} loan_person 贷款人
	 *
	 * @apiPermission none
	 * @apiSampleRequest /loanCompany/:id
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
	 *       	"product": "product",
	 *       	"spot_amount": "spot_amount",
	 *       	"sell_amount": "sell_amount",
	 *       	"business_licence": "business_licence",
	 *       	"opening_permission": "opening_permission",
	 *       	"business_permission": "business_permission",
	 *       	"address_province": "address_province",
	 *       	"address_city": "address_city",
	 *       	"address_district": "address_district",
	 *       	"address_detail": "address_detail",
	 *       	"sales_customer": "sales_customer",
	 *       	"loan_person": "loan_person",
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
		if (req.body.product) {
			body.product = req.body.product
		};
		if (typeof req.body.spot_amount !='undefined' && req.body.spot_amount!='') {
			body.spot_amount = req.body.spot_amount
		};
		if (typeof req.body.sell_amount !='undefined' && req.body.sell_amount!='') {
			body.sell_amount = req.body.sell_amount
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
		if (req.body.sales_customer) {
			body.sales_customer = req.body.sales_customer
		};
		if (req.body.business_licence) {
			body.business_licence = req.body.business_licence
		};
		if (req.body.opening_permission) {
			body.opening_permission = req.body.opening_permission
		};
		if (req.body.business_permission) {
			body.business_permission = req.body.business_permission
		};

		this.model.put(query, body)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '更新成功', doc)
		})
		.catch(err => next(err))
	}

	/**
	 * @api {delete} /loanCompany/:id 删除某个指定资源
	 * @apiDescription 删除某个指定资源
	 * @apiName delete
	 * @apiGroup loanCompany
	 *
	 * @apiParam {String} id 资源ID
	 * @apiSampleRequest /loanCompany/:id
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
	 * @api {search} /loanCompany/search/all 按关键词查询资源
	 * @apiDescription 按关键词查询资源
	 * @apiName search
	 * @apiGroup loanCompany
	 *
	 * @apiParam {String} keyword 关键词
	 * @apiSampleRequest /loanCompany/search/all
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


export default LoanCompany



