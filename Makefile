IMAGE_NAME := rsshub-backend:v1.0.0

build-image:
	docker build -t $(IMAGE_NAME) -f build/backend/Dockerfile . 
