from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, FileResponse
# import StaticFiles, FileResponse & pathlib to serve an HTML file
from fastapi.staticfiles import StaticFiles
import pathlib

from app.db import Base, engine
from app.routers import classroom_router, school_router, user_router

Base.metadata.create_all(bind=engine)

# call folder.file:variable (app.app:app --reload) to run test server
app = FastAPI()

# mount the necessary files to see the results in HTML
app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(school_router)
app.include_router(classroom_router)
app.include_router(user_router)

# serve up the HTML file
@app.get("/", response_class=FileResponse)
async def serve_index():
    index_path=pathlib.Path("app/static/index.html")
    return FileResponse(index_path)

@app.get("/")
async def root() -> RedirectResponse:
    """
    Handle calls to root domain.

    Returns:
        dict: A dictionary with a message.
    """
    return RedirectResponse(url="/docs")
