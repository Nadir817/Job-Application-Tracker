import uvicorn

if __name__ == "__main__":
    uvicorn.run("api.api:app", reload=True)
