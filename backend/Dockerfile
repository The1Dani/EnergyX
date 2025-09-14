from python:slim

EXPOSE 5000

COPY data /opt/data
COPY api /app

WORKDIR /app

ARG KEY 
ENV OPENAI_API_KEY $KEY

RUN pip install -r "requirements.txt"

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]