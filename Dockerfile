FROM python:3.10

# Set up a new user named "user" with user ID 1000 for Hugging Face Spaces
RUN useradd -m -u 1000 user

# Switch to the "user" user
USER user

# Set home to the user's home directory
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    TRANSFORMERS_CACHE=/home/user/app/cache

WORKDIR $HOME/app

# Copy the requirements and install them securely
COPY --chown=user ./requirements.txt $HOME/app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r $HOME/app/requirements.txt

# Create cache directory and make sure it has the right permissions
RUN mkdir -p $HOME/app/cache

# Copy the actual application code
COPY --chown=user ./app $HOME/app/app

# Expose the standard port for Hugging Face Spaces
EXPOSE 7860

# Run the FastAPI application on port 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
