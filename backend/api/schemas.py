from pydantic import BaseModel


class JobBase(BaseModel):
    companyName: str
    jobTitle: str
    workType: str
    pay: int


class JobCreate(JobBase):
    pass


class Job(JobBase):
    id: int

    class Config:
        orm_mode = True
