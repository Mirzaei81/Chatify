import json
from channels import Group
from typing import Optional
from channels.sessions import channel_session
from urllib.parse import parse_qs

@channel_session
def ws_connect(message, room_name):
    # Accept connection
    message.reply_channel.send({"accept": True})
    # Parse the query string
    params = parse_qs(message.content["query_string"])
    if b"username" in params:
        # Set the username in the session
        message.channel_session["username"] = params[b"username"][0].decode("utf8")
        # Add the user to the room_name group
        Group("chat-%s" % room_name).add(message.reply_channel)
    else:
        # Close the connection.
        message.reply_channel.send({"close": True})
@channel_session
def ws_message(message,room_name):
    Group("chat-%s" % room_name).send( { 
        "text":json.dumps({
                                                               "text":message["text"]
                                                           }) "username": }
    )




