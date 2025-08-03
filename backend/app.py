# app.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import joblib, re, string
from newspaper import Article, Config
import uvicorn

app = FastAPI()

#-----CORS--------------------
app.add_middleware( #intercepts every inc request
    CORSMiddleware,
    allow_origins=["*"],      # chagne later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# model load
model = joblib.load("fake_news_classifier.joblib")

# clean data
def clean_text(s:str) -> str:
    s = s.lower()
    s = re.sub(f"[{re.escape(string.punctuation)}]", " ", s)
    s = re.sub(r"\s+"," ", s).strip()
    return s

# schemas
class NewsIn(BaseModel):
    url: HttpUrl #incoming MUST be urls(http or https)
class NewsOut(BaseModel):
    label: str #outgoing should be json with strig

# -------Newspaper 3k config--------------
user_agent = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/50.0.2661.102 Safari/537.36"
)
np_config = Config()
np_config.request_timeout = 20
np_config.browser_user_agent = user_agent

def download_article(url:HttpUrl) -> str:
    art = Article(str(url), config=np_config)
    try:
        art.download()
        art.parse()
    except Exception:
        raise HTTPException(status_code=400,detail="Couldnt extract article text or download data")
    if not art.text: #if it recived data but parsed result is blank
        raise HTTPException(status_code=400,detail="Couldnt extract article text")
    return art.text

@app.post("/predict", response_model=NewsOut)
def predict(news: NewsIn):
    raw = download_article(news.url)
    #print(raw)
    cleaned = clean_text(raw)
    pred = model.predict([cleaned])[0]
    #print(pred)
    return {"label":"Reliable" if pred == 1 else "Unreliable"}

if __name__ =="__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
