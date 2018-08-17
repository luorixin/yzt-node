import qiniu from '../controllers/qiniu'


export default function(app){
	new qiniu(app)
}