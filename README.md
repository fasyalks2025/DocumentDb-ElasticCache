.env
MONGO_URL = `ENDPOINT DOCUMENTDB`
REDIS_URL = `ENDPOINT ELASTIC CACHE`

NOTE TO SELF:
- create resource which take time the longest first (e.g DB, Cache, etc)  
- dont forget use prefix such as redis:// when providing url for DB
- run in ec2 instance first before pushing image to repo, dont get too confident
- pay attention really well on security group
