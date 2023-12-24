# Get the image we're doing to use to build
FROM python:3.12-slim
# Create and set the working directory
WORKDIR /app
# Copy files and add them to the container's filesystem
COPY . ./
# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
# Set up host information
ENV HOST 0.0.0.0
EXPOSE 8888
# Run the gunicorn server - "run:app" is because we've imported the create_app() function
# from the sturmbaum/app.py which is where we do most of the app setup
CMD [ "gunicorn", "-b", "0.0.0.0:8888", "run:app" ]