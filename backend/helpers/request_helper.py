import requests

def get(url):
    return requests.get(url=url,headers={"client-secret":"9923ac9b-8fd3-421f-b0e5-952f807c6885"}).json()