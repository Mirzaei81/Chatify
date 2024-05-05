from django.db import models
import supabase 
import os
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

supaBaseObj = supabase.create_client(SUPABASE_URL,SUPABASE_KEY)
