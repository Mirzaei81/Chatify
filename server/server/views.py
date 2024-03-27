from django.http.response import HttpResponse

# Create your views here.
def index(r):
    return HttpResponse(b"<h1>helloWorld</h1>")

def room(r,room_name):
    res = f"<h1>Welcome to {room_name}".encode("utf-8")
    return HttpResponse(res)
