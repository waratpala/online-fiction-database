FROM python:3.11

EXPOSE 5000

WORKDIR /api

COPY requirements.txt /api
RUN pip install -r requirements.txt

ENV FLASK_ENV=development

COPY . .

# CMD ["python3", "-m" , "flask", "run", "--host=0.0.0.0"]
CMD ["python3", "app.py"]