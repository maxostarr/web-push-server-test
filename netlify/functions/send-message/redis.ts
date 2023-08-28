import redis from 'ioredis'

export const client = new redis({
  port: 10146,
  host: 'redis-10146.c280.us-central1-2.gce.cloud.redislabs.com',
  password: 'XoVCCXrnBXdfV07V6jICGBZphJDCbDzu'
})
