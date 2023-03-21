from sqlalchemy.orm import Session

from . import models, schemas


def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Job).offset(skip).limit(limit).all()


def create_job(db: Session, job: schemas.JobCreate):
    db_item = models.Job(**job.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
