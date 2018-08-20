import RestBase from './restBase'
import UserBase from './user'
import user from '../models/user'
import loanPerson from '../models/loanPerson'
import loanCompany from '../models/loanCompany'

export default {
	user: new UserBase(user),
	loanPerson: new RestBase(loanPerson),
	loanCompany: new RestBase(loanCompany),
}