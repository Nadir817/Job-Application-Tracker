from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .db import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()


origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# class Job(BaseModel):
#     id: int
#     companyName: str
#     workType: str
#     jobTitle: str
#     pay: Union[int, None] = None


# db = [
#     {'id': 1, 'companyName': 'Amazon', 'workType': 'Remote', 'jobTitle': 'software engineer', 'pay': 100000},
#     {'id': 2, 'companyName': 'BoA', 'workType': 'On-Site', 'jobTitle': 'software engineer', 'pay': 123000}
# ]


# @app.get('/lists/', tags=['lists'])
# def main() -> dict:
#     return {'data': db}
@app.get("/jobs/", response_model=list[schemas.Job])
def read_jobs(skip: int = 0, limit: int = 100, database: Session = Depends(get_db)):
    jobs = crud.get_jobs(database, skip=skip, limit=limit)
    return jobs


# @app.post('/list/', tags=['lists'])
# async def add_list(l: Job) -> dict:
#     # dummy = {'id': 0, 'companyName': '', 'workType': '', 'jobTitle': '', 'pay': 0}
#     # dummy.update(**l)
#     db.append(l.dict())
#     return {'data': 'new list added'}

@app.post("/job/", response_model=schemas.Job)
def create_job(
        job: schemas.JobCreate, database: Session = Depends(get_db)
):
    return crud.create_job(db=database, job=job)
