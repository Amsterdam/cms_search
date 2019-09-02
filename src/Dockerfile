FROM amsterdam/python
MAINTAINER datapunt@amsterdam.nl
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . ./