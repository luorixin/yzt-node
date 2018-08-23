import qiniu from '../controllers/qiniu'
import user from '../controllers/user'
import loanCompany from '../controllers/loanCompany'
import loanPerson from '../controllers/loanPerson'
import upload from '../controllers/upload'


export default function(app){
	new qiniu(app)
	new user(app)
	new loanPerson(app)
	new loanCompany(app)
	new upload(app)
}