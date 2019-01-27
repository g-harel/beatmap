import requests

def get(url):
    resp = requests.get(url=url,headers={"client-secret":"9923ac9b-8fd3-421f-b0e5-952f807c6885"})
    print(resp)
    if resp.status_code == 500:
        print("herre")
        return None
    else:
        return resp.json()
