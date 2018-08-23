import FS from 'fs'
import bluebird from 'bluebird'
import formidable from 'formidable'
import request from 'request'
import cheerio from 'cheerio'
import captchapng from 'captchapng'
import proxy from '../proxy'
import config from '../config'

const fs = bluebird.promisifyAll(FS)

class Upload{
	constructor(app){
		Object.assign(this,{
			app,
			loanPerson : proxy.loanPerson,
			loanCompany : proxy.loanCompany,
		})
		this.init()
	}

	init(){
		this.routes();
	}

	routes(){
		this.app.post('/api/upload/file', this.uploadFile.bind(this))
		this.app.post('/api/upload/sign/check', this.signCheck.bind(this))
		this.app.get('/api/upload/captcha(/:width)?(/:height)?', this.captcha.bind(this))
	}

	/**
     * 创建表单上传
	 */
	initFormidable(req, callback) {
		const form = new formidable.IncomingForm();
		//设置编码
		form.encoding = 'utf-8'

		//设置文件存储路径
		form.uploadDir = config.upload.tmp

		//保留后缀
		form.keepExtensions = true

		//设置单文件大小限制
		form.maxFieldsSize = 2 * 1024 * 1024

		//设置所有文件大小总和
		form.maxFields = 1000

		form.parse(req,(err, fields, files) => callback(err,fields,files))
	}

	/**
	 * @api {post} /upload/file 上传文件
	 * @apiDescription 上传文件
	 * @apiName uploadFile
	 * @apiGroup upload
	 *
	 * @apiParam {File} files 文件
	 * @apiParam {String} model 文件保存对应的模型
	 * @apiParam {String} model_id 模型的主键
	 * @apiParam {String} model_name 模型的需要更新的字段名字
	 *
	 * @apiPermission none
	 * @apiSampleRequest /upload/file
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "上传成功"
	 *       },
	 *       "data": {
	 *       	"_id": "_id",
	 *       	"name": "name",
	 *       	"path": "path",
	 *       	"create_at": "create_at"
	 *       }
	 *     }
	 */
	uploadFile(req, res, next) {
		let that = this
		this.initFormidable(req, (err, fields, files) => {
			for (let item in files) {
				const file         = files[item] 
				const tempfilepath = file.path 
				const filenewname  = res.tools.randFilename(file) 
				const filenewpath  = config.upload.path +  filenewname
				const result       = 'uploads/' + filenewname

				// 将临时文件保存为正式的文件
				const query = {
					_id: fields.model_id
				}

				const body = {
				}
				body[fields.model_name] = result
				console.log(body,query)
				that[fields.model].put(query, body)
				.then(doc => {
					if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
						console.log(doc)
					return fs.renameAsync(tempfilepath, filenewpath)	
				})
				.then(doc => res.tools.setJson(0, '上传成功', {
					_id:fields.model_id,
					name:file.name,
					path:result,
					model_name:fields.model_name,
					model_id:fields.model_id
				}))
				.catch(err => next(err))
			}
		})
	}

	

	/**
	 * @api {post} /upload/sign/check 登录认证
	 * @apiDescription 登录认证
	 * @apiName signCheck
	 * @apiGroup upload
	 *
	 * @apiPermission none
	 * @apiSampleRequest /upload/sign/check
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
	 *       "data": null
	 *     }
	 */
	signCheck(req, res, next) {
		return res.tools.setJson(0, '调用成功')
	}

	/**
	 * @api {get} /upload/captcha/:width/:height 验证码
	 * @apiDescription 验证码
	 * @apiName captcha
	 * @apiGroup upload
	 *
	 * @apiParam {String} width 宽度
	 * @apiParam {String} height 高度
	 * 
	 * @apiPermission none
	 * @apiSampleRequest /upload/captcha/:width/:height
	 */
	captcha(req, res, next) {
		const width   = parseInt(req.params.width) || 80
		const height  = parseInt(req.params.height) || 30
		const code    = req.session.code = parseInt(Math.random() * 9000 + 1000)
		const captcha = new captchapng(width, height, code)

        captcha.color(0, 0, 0, 0)
        captcha.color(80, 80, 80, 255)

        const img = captcha.getBase64()
        const imgbase64 = new Buffer(img, 'base64')

		res.end(imgbase64)
	}

}

export default Upload


