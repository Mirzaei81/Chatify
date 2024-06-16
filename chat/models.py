import aiohttp
from django.core.cache import cache

class supabase:
    header={}
    def __init__(self,url:str,key:str) -> None:
        self.url = url
        self.key = key
        self.header = {
            "Authorization": f"Bearer {key}",
            "apikey":f"{url}",
            "Content-Type": "application/json"
            }

    async def get_message(self,roomName:str):
        url = "https://wuarpjeerptfdsdttoqo.supabase.co/rest/v1/rpc/get_messages_by_room_name"
        cached_data = cache.get(roomName)
        if cached_data:
            return cached_data
        async with aiohttp.ClientSession() as session:
            response  =await session.post(url, headers=self.header, allow_redirects=True,json={"room_name":roomName})
            assert response.status == 200
            messages = await response.json()
            messages = [{"message_body":message["message_body"],"author":message["author"].replace('"',""),'url':message['url'], 'created_at':message['created_at'] } for message in messages]
            cache.set(roomName,messages,timeout=10)
            return messages

    async def insert_messages(self,txt,created,room_name,username):
       async with aiohttp.ClientSession() as session:
            data= { 'body': txt, "created_at": created, "room_name":room_name,"username":username }
            async with session.post('https://wuarpjeerptfdsdttoqo.supabase.co/rest/v1/rpc/insert_message',headers=self.header,json=data) as resp :
                return resp


