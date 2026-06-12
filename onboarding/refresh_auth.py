"""
Refresh onboarding/auth.json with a fresh Supabase session.
Run from the project root:  python onboarding/refresh_auth.py
"""
import json, base64, urllib.request, time, os

SUPABASE_URL = "https://mbslkjxkleiudzsbjqau.supabase.co"
ANON_KEY     = "sb_publishable_fVnkpDtKO7k6CgsmobOHUA_lC15YKbd"
EMAIL        = "lehrer@hko.ch"
PASSWORD     = "demo1234"

body = json.dumps({"email": EMAIL, "password": PASSWORD}).encode()
req  = urllib.request.Request(
    f"{SUPABASE_URL}/auth/v1/token?grant_type=password", data=body,
    headers={"Content-Type": "application/json",
             "apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}"})
with urllib.request.urlopen(req) as r:
    data = json.loads(r.read())

cookie_val = "base64-" + base64.b64encode(json.dumps(data).encode()).decode()
project_id = SUPABASE_URL.split("//")[1].split(".")[0]
expires    = int(time.time()) + 86400 * 7

auth = {
  "cookies": [{
    "name":     f"sb-{project_id}-auth-token",
    "value":    cookie_val,
    "domain":   "localhost",
    "path":     "/",
    "expires":  expires,
    "httpOnly": False,
    "secure":   False,
    "sameSite": "Lax"
  }],
  "origins": []
}

out = os.path.join(os.path.dirname(__file__), "auth.json")
json.dump(auth, open(out, "w"), indent=2)
print(f"✓ auth.json refreshed for {data['user']['email']}")
print(f"  Expires: {time.strftime('%Y-%m-%d %H:%M', time.localtime(expires))}")
