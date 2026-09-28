from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import engine, get_db
from schema import UserRegistrationIn, UserRegistrationOut
import model

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

model.Base.metadata.create_all(bind=engine)

@app.post("/register", response_model=UserRegistrationOut)
async def userRegistration(
    user: UserRegistrationIn,
    db: Annotated[Session, Depends(get_db)]
):
    db_user = model.User(
        username=user.username,
        email=user.email,
        hashed_password=user.password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user




