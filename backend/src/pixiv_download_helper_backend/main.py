from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .download_pixiv import download_image
from .schemas import IllustInfo

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/download-image")
async def receive_json(illust_info: IllustInfo):
    """
    Receives illustration information, prints it, and returns it.
    """
    print(illust_info)
    download_image(illust_info)
    return illust_info
