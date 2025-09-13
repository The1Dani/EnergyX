from python:slim

EXPOSE 5000

COPY data /opt/data
COPY api /app

WORKDIR /app

RUN pip install -r "requirements.txt"

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]