# Multistage build - start with things needed to build react
# Get the node image 
FROM node:21.5-slim as build
# Set a working directory
WORKDIR /app
# Copy over the NPM files
COPY ./sturmbaum/static/package.json ./
COPY ./sturmbaum/static/package-lock.json ./
COPY ./sturmbaum/static/webpack.config.js ./
# Run NPM install in CI mode
RUN npm ci
# Copy the files over from the existing scripts directory and get dependencies built
COPY ./sturmbaum/static/scripts ./scripts/
RUN npm run build


# Get the image we're doing to use to build
FROM python:3.11-slim
ENV PYTHONUNBUFFERED True
# Create and set the working directory
WORKDIR /app
# Copy files and add them to the container's filesystem
COPY . ./
# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
# Bring over react dependencies from the build
COPY --from=build ./app/dist/ ./static/dist
# Set up host information
ENV HOST 0.0.0.0
EXPOSE 8888
# Run the gunicorn server - "run:app" is because we've imported the create_app() function
# from the sturmbaum/app.py which is where we do most of the app setup
CMD [ "gunicorn", "-b", "0.0.0.0:8888", "run:app" ]