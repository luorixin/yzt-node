import redis from 'redis'
import config from '../config'

const redisLink = config['redis'][process.env.NODE_ENV || 'development']['connectionString']
const redisPassword = config['redis'][process.env.NODE_ENV || 'development']['password']
const redisClient = redis.createClient(redisLink)
redisClient.auth(redisPassword, function(){
	console.log('认证通过')
});

redisClient
	.on('error', err => console.log('------ Redis connection failed ------' + err))
	.on('connect', () => console.log('------ Redis connection succeed ------'))

export default {
	redis: redis, 
	redisClient: redisClient, 
}