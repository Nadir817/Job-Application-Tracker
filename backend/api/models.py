from .db import Base
from sqlalchemy import Column, Integer, String


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    companyName = Column(String, index=True)
    jobTitle = Column(String, index=True)
    workType = Column(String, index=True)
    pay = Column(Integer, index=True)
