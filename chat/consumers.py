from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.conf import settings
from .fa_to_lat import fa_to_lat
from .parser import parser
from .models import sb, supabase
import json
from time import time

SUPABASE_URL = settings.SUPABASE_URL
SUPABASE_KEY = settings.SUPABASE_KEY
SupaBase = supabase(SUPABASE_URL,SUPABASE_KEY)
print(SUPABASE_KEY,SUPABASE_URL,settings.ALLOWED_HOSTS,settings.DEBUG)
class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name_latin = ""
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        print(self.scope["query_string"])
        params=  parser(self.scope["query_string"].decode("ascii"))
        for c in self.room_name:
            if c in fa_to_lat:
                self.room_name_latin+= fa_to_lat[c]
            else:
                self.room_name_latin+= c

        self.room_group_name = f"chat_{self.room_name_latin}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        await self.channel_layer.group_send(self.room_group_name,{
                "type":"chat.notice",
                "message":params['user_name']
            })
        message = await SupaBase.get_message(roomName=self.room_name)
        await self.channel_layer.group_send(self.room_group_name,{
            "type":"chat.init",
            "message":message
            })

    async def disconnect(self,code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data=None,bytes_data=None):
        if type(text_data) is str:
            text_data_json = json.loads(text_data)
            print(text_data_json)
            message_body = text_data_json["message_body"]
            author = text_data_json["author"]
            url = text_data_json["url"]
            created_at = int(time())
            #sending the data over 
            data = await sb.insert_messages( message_body,created_at,self.room_name,author)
            print(data)
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat.message",
                    "url":url, "message_body": message_body,
                    "author":author,"created_at":created_at}
            )

    async def chat_notice(self,event):
        message = event["message"] 
        await self.send_json(json.dumps({"message":message,"type":"Notice",}))

    async def chat_init(self,event):
        message = event["message"] 
        await self.send(json.dumps({"data":message,"type":"init"}))

    # Receive message from room group
    async def chat_message(self, event):
        message_body = event["message_body"]
        author = event["author"]
        url = event["url"]
        created_at = event["created_at"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"type": "message",
                    "url":url, "message_body": message_body,
                    "author":author,"created_at":created_at}))



