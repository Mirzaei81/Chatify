import sqlalchemy as sa

connection_url = sa.engine.URL.create(
    drivername="postgresql",
    username=   "postgres.wuarpjeerptfdsdttoqo",
    host=       "aws-0-eu-central-1.pooler.supabase.com",
    database=   "postgres",
    password=   "@M1r@rsh1@M1rz@e181",
    
)
print(connection_url)  # postgresql://user:p%40ss@host/database
try:
    engine = sa.create_engine(connection_url)
    connection = engine.connect()
    print("Connection successful!")
    connection.close()
except Exception as e:
    print(f"Error connecting to the database:\n {e}")