from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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

db = [
    {'id': 1, 'companyName': 'Amazon', 'workType': 'Remote', 'jobTitle': 'software engineer', 'pay': 100000},
    {'id': 2, 'companyName': 'BoA', 'workType': 'On-Site', 'jobTitle': 'software engineer', 'pay': 123000}
]


@app.get('/lists/', tags=['lists'])
def main() -> dict:
    return {'data': db}


@app.post('/list/', tags=['lists'])
async def add_list(l: dict) -> dict:
    dummy = {'id': 0, 'companyName': '', 'workType': '', 'jobTitle': '', 'pay': 0}
    dummy.update(**l)
    db.append(dummy)
    return {'data': 'new list added'}
